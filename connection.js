function Connection(input, output, innovation) {
  this.input      = input;
  this.output     = output;
  this.enabled    = true;
  this.innovation = innovation;
  this.weight     = random(-1, 1);
  
  this.mutateWeight = function() {
    this.weight += random(-mutation_amount, mutation_amount);
  }
  
  this.mutateEnabled = function() {
    this.enabled = !this.enabled;
  }
  
  this.clone = function(input, output) {
    var clone     = new Connection(input, output, this.innovation);
    clone.enabled = this.enabled;
    clone.weight  = this.weight;
    return clone;
  }
}

function ConnectionHistory(input, output, innovation, all_innovations) {
  this.input = input;
  this.output = output;
  this.innovation = innovation;
  this.all_innovations = [];
  arrayCopy(all_innovations, this.all_innovations);
  
  this.doMatch = function(network, input, output) {
    if (network.connections.length == this.all_innovations.length) {
      if (input.id == this.input && output.id == this.output) {
        for (var i = 0; i < network.connections.length; i++) {
          if (!this.all_innovations.includes(network.connections[i].innovation)) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }
}