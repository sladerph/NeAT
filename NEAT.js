var mutation_amount = 0.25;

var change_weight_rate  = 0.3;
var toggle_enabled_rate = 0.01;
var add_node_rate       = 0.02;
var add_connection_rate = 0.1; 
var learning_rate       = 0.3;

function Network(nb_inputs, nb_outputs, crossover) {
  this.nodes       = [];
  this.connections = [];
  this.network     = [];
  
  this.layers = 2;
  this.current_id = nb_inputs;
  this.innovation = 0;
  this.bias;
  
  this.nb_inputs  = nb_inputs;
  this.nb_outputs = nb_outputs;
  
  for (var i = 0; i < nb_inputs; i++) {
    this.nodes.push(new Node(i, 0, "Input"));
  }
  for (var i = 0; i < nb_outputs; i++) {
    this.nodes.push(new Node(this.current_id, 1, "Output"));
    this.current_id++;
  }
  this.nodes.push(new Node(this.current_id, 0, "Bias"));
  this.bias = this.current_id;
  this.current_id++;
  
  if (crossover) {
    this.nodes = [];
    this.connections = [];
    this.network = [];
    this.layers = 2;
    this.current_id = 0;
  }
  
  this.connect = function() {
    var len = this.nodes.length;
    for (var i = 0; i < len; i++) {
      this.nodes[i].output_connections = [];
    }
    
    for (var i = 0; i < this.connections.length; i++) {
      this.connections[i].input.output_connections.push(this.connections[i]);
    }
  }
  
  this.createNetwork = function() {
    this.connect();
    this.network = [];
    for (var lay = 0; lay < this.layers; lay++) {
      for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].layer == lay) {
          this.network.push(this.nodes[i]);
        }
      }
    }
  }
  
  this.calculate = function(inputs) {
    // Inputs are already mapped between -1 and 1.
    
    for (var i = 0; i < this.nodes.length; i++) {
      this.nodes[i].input_value  = 0;
      this.nodes[i].output_value = 0;
    }
    
    for (var i = 0; i < this.nb_inputs; i++) {
      this.nodes[i].output_value = inputs[i];
    }
    this.nodes[this.bias].output_value = 1;
    
    for (var i = 0; i < this.network.length; i++) {
      this.network[i].fire();
    }
    
    var output = new Array(this.nb_outputs);
    for (var i = 0; i < this.nb_outputs; i++) {
      output[i] = this.nodes[i + this.nb_inputs + 1].output_value;
    }
    
    return output;
  }
  
  this.isFullyConnected = function() {
    var max_connections = 0;
    var nodes_by_layer = new Array(this.layers);
    
    for (var i = 0; i < this.nodes.length; i++) {
      nodes_by_layer[this.nodes[i].layer]++;
    }
    
    for (var i = 0; i < this.layers - 1; i++) {
      var front_nodes = 0;
      for (var j = i + 1; j < this.layers; j++) {
        front_nodes += nodes_by_layer[j];
      }
      max_connections += nodes_by_layer[i] * front_nodes;
    }
    
    if (this.connections.length == max_connections) {
      return true;
    }
    return false;
  }
  
  this.addConnection = function(history) {
    if (this.isFullyConnected) {
      console.log("*** Unable to create a new connection !      ***");
      console.log("*** The network is already fully connected ! ***");
      return;
    }
    
    // Choosing input node for the connection.
    do {
      var input = floor(random(this.nodes.length));
      while (this.nodes[input].type == "Output") {
        input = floor(random(this.nodes.length));
      }
      
      var output = floor(random(this.nodes.length));
      while (this.nodes[output].layer <= this.nodes[input].layer) {
        output = floor(random(this.nodes.length));
      }
    } while(this.nodes[input].isConnectedTo(this.nodes[output]));
    
    var connection_innovation = this.getInnovation(history, this.nodes[input], this.nodes[output]);
    var con = new Connection(this.nodes[input], this.nodes[output], connection_innovation);
    this.connections.push(con);
    this.connect();
  }
}

Network.prototype.getInnovation = function(history, input, output) {
  var is_new = true;
  var con_innovation = this.innovation;
  
  for (var i = 0; i < history.length; i++) {
    if (history[i].doMatch(this, input, output)) {
      is_new = false;
      con_innovation = history[i].innovation;
      break;
    }
  }
  
  if (is_new) {
    var innovations = [];
    for (var i = 0; i < this.connections.length; i++) {
      innovations.push(this.connections[i].innovation);
    }
    
    history.push(new ConnectionHistory(input.id, output.id, con_innovation, innovations));
    this.innovation++;
  }
  return con_innovation;
}

Network.prototype.addNode = function(history) {
  var rnd_con = floor(random(this.connections.length));
  
  while (this.connections[rnd_con].input == getNode(this.nodes, this.bias) && this.connections.length != 1) {
    var rnd_con = floor(random(this.connections.length));
  }
  
  // Disabling the connection.
  this.connections[rnd_con].enabled = false;
  
  // Creating the new node.
  var id_new_node = this.current_id;
  this.current_id++;
  this.nodes.push(new Node("Hidden", 0, id_new_node));
  
  // Creating a connection to this new node with a weight of 1.
  var connection_innovation = this.getInnovation(history, this.connections[rnd_con].input, getNode(this.nodes, id_new_node));
  var con = new Connection(this.connections[rnd_con].input, getNode(this.nodes, id_new_node), connection_innovation);
  con.weight = 1;
  this.connections.push(con);
  
  // Creating a connection from the new node to the output of the random connection with the weight of this connection.
  connection_innovation = this.getInnovation(history, getNode(this.nodes, id_new_node), this.connections[rnd_con].output);
  con = new Connection(getNode(this.nodes, id_new_node), this.connections[rnd_con].output, connection_innovation);
  con.weight = this.connections[rnd_con].weight;
  this.connections.push(con);
  
  getNode(this.nodes, id_new_node).layer = this.connections[rnd_con].input.layer + 1;
  
  connection_innovation = this.getInnovation(history, getNode(this.nodes, this.bias), getNode(this.nodes, id_new_node));
  con = new Connection(getNode(this.nodes, this.bias), getNode(this.nodes, id_new_node), connection_innovation);
  con.weight = 0;
  this.connections.push(con);
  
  // Checking layers.
  if (getNode(this.nodes, id_new_node).layer == this.connections[rnd_con].output.layer) {
    for (var i = 0; i < this.nodes.length - 1; i++) {
      if (this.nodes[i].layer >= getNode(this.nodes, id_new_node).layer) {
        this.nodes[i].layer++;
      }
    }
    this.layers++;
  }
  this.connect();
}

Network.prototype.matchingConnection = function(parent, innovation) {
  for (var i = 0; i < parent.connections.length; i++) {
    if (parent.connections[i].innovation == innovation) {
      return i;
    }
  }
  return -1;
}

Network.prototype.crossover = function(dad) {
  var child = new Network(this.nb_inputs, this.nb_outputs, true);
  child.layers = this.layers;
  child.current_id = this.current_id;
  child.bias = this.bias;
  var child_connections = [];
  var is_enabled = [];
  
  for (var i = 0; i < this.connections.length; i++) {
    var will_be_enabled = true;
    var index_matching_connection_dad = this.matchingConnection(dad, this.connections[i].innovation);
    
    if (index_matching_connection_dad != -1) { // Match found.
      if (!this.connections[i].enabled || !dad.connections[index_matching_connection_dad].enabled) {
        if (random(1) < 0.75) { // Disable the child's connection 75% of the time.
          will_be_enabled = false;
        }
      }
      if (random(1) < 0.5) { // 50%.
        child_connections.push(this.connections[i]);
      } else {
        child_connections.push(dad.connections[index_matching_connection_dad]);
      }
    } else { // No match found --> Disjoint or Excess connection (gene).
      child_connections.push(this.connections[i]);
      will_be_enabled = this.connections[i].enabled;
    }
    is_enabled.push(will_be_enabled);
  }
  
  for (var i = 0; i < this.nodes.length; i++) {
    child.nodes.push(this.nodes[i].clone());
  }
  
  for (var i = 0; i < child_connections.length; i++) {
    child.connections.push(child_connections[i].clone(getNode(child.nodes, child_connections[i].input.id), getNode(child.nodes, child_connections[i].output.id)));
    child.connections[i].enabled = is_enabled[i];
  }
  
  child.connect();
  return child;
}

Network.prototype.mutate = function(history) {
  for (var i = 0; i < this.connections.length; i++) {
    if (random(1) < change_weight_rate) {
      this.connections[i].mutateWeight();
      console.log("#MUTATION");
    }
    if (random(1) < toggle_enabled_rate) {
      this.connections[i].mutateEnabled();
      console.log("#MUTATION");
    }
  }
  if (random(1) < add_connection_rate) {
    this.addConnection(history);
    console.log("#MUTATION");
  }
  if (random(1) < add_node_rate && this.connections.length > 1) {
    this.addNode(history);
    console.log("#MUTATION");
  }
}

Network.prototype.clone = function() {
  var clone = new Network(this.nb_inputs, this.nb_outputs, true);
  
  for (var i = 0; i < this.nodes.length; i++) {
    clone.nodes.push(this.nodes[i].clone());
  }
  
  for (var i = 0; i < this.connections.length; i++) {
    clone.connections.push(this.connections[i].clone(getNode(clone.nodes, this.connections[i].input.id), getNode(clone.nodes, this.connections[i].output.id)));
  }
  
  clone.layers = this.layers;
  clone.current_id = this.current_id;
  clone.bias = this.bias;
  clone.connect();
  
  return clone;
}

Network.prototype.draw = function(start_x, start_y, w, h) {
  var all_nodes = [];
  var node_pos  = [];
  var node_ids  = [];
  var node_vals = [];
  
  for (var i = 0; i < this.layers; i++) {
    var temp = [];
    for (var j = 0; j < this.nodes.length; j++) {
      if (this.nodes[j].layer == i) {
        temp.push(this.nodes[j]);
      }
    }
    all_nodes.push(temp);
  }
  
  for (var i = 0; i < this.layers; i++) {
    var x = start_x + ((i * w) / (this.layers - 1));
    for (var j = 0; j < all_nodes[i].length; j++) {
      var y = start_y + ((j + 1) * h) / (all_nodes[i].length + 1);
      node_pos.push(createVector(x, y));
      node_ids.push(all_nodes[i][j].id);
      node_vals.push(all_nodes[i][j].output_value);
    }
    if (i == this.layers - 1) {
      //console.log(i, j, x, y);
    }
  }
  
  // Draw the connections.
  stroke(0);
  strokeWeight(2);
  for (var i = 0; i < this.connections.length; i++) {
    var from = node_pos[node_ids.indexOf(this.connections[i].input.id)];
    var to   = node_pos[node_ids.indexOf(this.connections[i].output.id)];
    if (this.connections[i].weight > 0) {
      stroke(255, 0, 0);
    } else {
      stroke(0, 0, 255);
    }
    strokeWeight(map(abs(this.connections[i].weight)), 0, 1, 0, 5);
    line(from.x, from.y, to.x, to.y);
  }
  
  // Draw the nodes.
  var c_red   = color(255, 0, 0);
  var c_green = color(0, 255, 0);
  for (var i = 0; i < node_pos.length; i++) {
    var c = lerpColor(c_red, c_green, node_values[i]);
    stroke(c);
    strokeWeight(1);
    fill(c);
    ellipse(node_pos[i].x, node_pos[i].y, 20, 20);
    textSize(10);
    fill(255);
    stroke(255);
    textAlign(CENTER, CENTER);
    text(node_ids[i], node_pos[i].x, node_pos[i].y);
  }
  
  //noFill();
}

function getNode(tab, id) {
  for (var i = 0; i < tab.length; i++) {
    if (tab[i].id == id) {
      return tab[i];
    }
  }
  console.log(tab);
  alert(id);
  return -1; // No such node in tab.
}

















//