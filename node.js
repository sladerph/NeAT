function Node(id, layer, type) {
  this.id                  = id;
  this.layer               = layer;
  this.type                = type;
  this.outputs_connections = [];
  this.input_value         = 0;
  this.output_value        = 0;
  
  this.fire = function() {
    if (this.layer != 0) { // Not input or bias, so activate the value.
      this.output_value = sigmoid(this.input_value);
    }
    
    for (var i = 0; i < this.output_connections.length; i++) {
      if (this.output_connections[i].enabled) {
        this.output_connections[i].output.input_value += this.output_value;
      }
    }
  }
  
  this.isConnectedTo = function(node) {
    if (this.layer == node.layer) { // If same layer --> can't be connected.
      return false;
    }
    
    if (this.layer > nodes.layer) { // This node may an output of the other node.
      for (var i = 0; i < nodes.output_connections.length; i++) {
        if (nodes.output_connections[i].output == this) {
          return true;
        }
      }
    } else { // This node may be an input of the other node.
      for (var i = 0; i < this.output_connections.length; i++) {
        if (this.output_connections[i].output == node) {
          return true;
        }
      }
    }
    return false;
  }
}

Node.prototype.clone = function() {
  var clone = new Node(this.type, this.id);
  clone.layer = this.layer;
  return clone;
}

function sigmoid(x) { // The sigmoid function.
  return (1 / (1 + pow(Math.E, -4.9 * x)));
}



//