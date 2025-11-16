import mongoose from "mongoose";


const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
      maxlength: [100, 'Nome não pode exceder 100 caracteres']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Descrição não pode exceder 500 caracteres']
    },
    price: {
      type: Number,
      required: [true, 'Preço é obrigatório'],
      min: [0, 'Preço não pode ser negativo']
    },
    category: {
      type: String,
      required: [true, 'Categoria é obrigatória'],
      trim: true
    },
    stock: {
      type: Number,
      required: [true, 'Estoque é obrigatório'],
      min: [0, 'Estoque não pode ser negativo'],
      default: 0
    }
  },
  {
    timestamps: true // Adiciona createdAt e updatedAt automaticamente
  }
);

// Índices para otimizar queries
ItemSchema.index({ name: 1 });
ItemSchema.index({ category: 1 });
ItemSchema.index({ createdAt: -1 });

export const Item = mongoose.model('Item', ItemSchema);