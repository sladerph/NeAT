function Species(player) {
  this.players = [];
  this.best_fitness = 0;
  this.best_ever;
  this.average_fitness = 0;
  this.generations_without_improvement = 0;
  this.structure;
  
  this.coeff_excess = 1;
  this.coeff_weight_difference = 0.5;
  this.compatibility_threshold = 3;
  
  if (player) {
    this.players.push(player);
    this.best_fitness = player.fitness;
    this.structure    = player.brain.clone();
    this.best_ever    = player;
  }
  
  this.getExcessAndDisjoint = function(a, b) {
    // Returns the number of non matching connections.
    var matching = 0;
    for (var i = 0; i < a.connections.length; i++) {
      for (var j = 0; j < b.connections.length; j++) {
        if (a.connections[i].innovation == b.connections[j].innovation) {
          matching++;
          break;
        }
      }
    }
    
    return (a.connections.length + b.connections.length - (2 * matching));
  }
  
  this.averageWeightDifference = function(a, b) {
    if (a.connections.length === 0 || b.connections.length === 0) {
      return 0;
    }
    
    var matching = 0;
    var total_difference = 0;
    
    for (var i = 0; i < a.connections.length; i++) {
      for (var j = 0; j < b.connections.length; j++) {
        if (a.connections[i].innovation == b.connections[j].innovation) {
          matching++;
          total_difference += abs(a.connections[i].innovation, b.connections[j].innovation);
          break;
        }
      }
    }
    
    if (!matching) {
      return 100;
    }
    return total_difference / matching;
  }
}

Species.prototype.areSameSpecies = function(genome) {
  var compatibility;
  var excess_and_disjoint = this.getExcessAndDisjoint(genome, this.structure);
  var average_weight_difference = this.averageWeightDifference(genome, this.structure);
  
  var large_genome_normalizer = genome.connections.length - 20;
  if (large_genome_normalizer < 1) {
    large_genome_normalizer = 1;
  }
  
  compatibility = (this.coeff_excess * excess_and_disjoint / large_genome_normalizer) + (this.coeff_weight_difference * average_weight_difference);
  console.log(compatibility);
  return (this.compatibility_threshold > compatibility);
}

Species.prototype.sortSpecies = function() {
  var temp = [];
  
  while (this.players.length > 0) {
    var maxi = 0;
    var max_index = 0;
    for (var j = 0; j < this.players.length; j++) {
      if (this.players[j].fitness > maxi) {
        maxi = this.players[j].fitness;
        max_index = j;
      }
    }
    
    temp.push(this.players[max_index]);
    this.players.splice(max_index, 1);
  }
  
  arrayCopy(temp, this.players);
  if (this.players.length === 0) {
    console.log("Fucking");
    this.generations_without_improvement = 200;
    return;
  }
  
  if (this.players[0].fitness > this.best_fitness) {
    this.generations_without_improvement = 0;
    this.best_fitness = this.players[0].fitness;
    this.structure    = this.players[0].brain.clone();
    this.best_ever    = this.players[0];
  } else {
    this.generations_witout_improvement++;
  }
  if (this.best_ever == undefined) {
    if (this.players.length > 0) {
      this.best_ever = this.players[0].clone();
    } else {
      this.best_ever = new Player();
    }
  }
}

Species.prototype.addToSpecies = function(player) {
  this.players.push(player);
}

Species.prototype.setAverage = function() {
  var sum = 0;
  for (var i = 0; i < this.players.length; i++) {
    sum += this.players[i].fitness;
  }
  this.average_fitness = sum / this.players.length;
}

Species.prototype.selectPlayer = function() {
  var fitness_sum = 0;
  for (var i = 0; i < this.players.length; i++) {
    fitness_sum += this.players[i].fitness;
  }

  var rand = random(fitness_sum);
  var actual_sum = 0;

  for (var i = 0; i < this.players.length; i++) {
    actual_sum += this.players[i].fitness;
    if (actual_sum > rand) {
      return this.players[i];
    }
  }
  return this.players[0];
}

Species.prototype.copulate = function(history) {
  var child = new Player();
  
  if (random(1) < 0.25) { // 25% of the time, the child is a clone of randomly one of the parents.
    child = this.selectPlayer().clone();
  } else { // Crossover.
    var parent1 = this.selectPlayer();
    var parent2 = this.selectPlayer();
    if (parent1 && parent2) {
      if (parent1.fitness > parent2.fitness) {
        child.brain = parent1.brain.crossover(parent2.brain);
      } else {
        child.brain = parent2.brain.crossover(parent1.brain);
      }
    } else {
      console.log("Error ! Parents are undefined");
    }
  }
  
  child.brain.mutate(history);
  return child;
}

Species.prototype.cull = function() {
  if (this.players.length > 2) {
    for (var i = this.players.length / 2; i < this.players.length; i++) {
      this.players.splice(i, 1);
      i--;
    }
  }
}

Species.prototype.fitnessSharing = function() {
  for (var i = 0; i < this.players.length; i++) {
    this.players[i].fitness /= this.players.length;
  }
}














//