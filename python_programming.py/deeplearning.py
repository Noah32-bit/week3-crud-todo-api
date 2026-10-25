import torch.nn as nn

class LinearLayer(nn.Module):
    def __init__ (self, input_dim, output_dim):
        super().__init__()
        self.linear = nn.linear(input_dim, output_dim)
        self.activation =  nn.Sigmoid()

def forward(self,x):
    return self.activation(self.linear(x))

