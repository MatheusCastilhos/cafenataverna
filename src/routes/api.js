import express from 'express';

import { Item } from '../models/Item.js';

const router = express.Router();

// Example route - Get all items
router.get('/items', async (req, res) => {
  try {
    // TODO: Implement database query
    res.json({ 
      message: 'Get all items',
      data: []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Example route - Get single item
router.get('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement database query
    res.json({ 
      message: `Get item ${id}`,
      data: null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Example route - Create item
router.post('/items', async (req, res) => {
  try {
    const data = req.body;
    
    // Validação básica
    if (!data.name || !data.price || !data.category) {
      return res.status(400).json({ 
        message: 'Campos obrigatórios: name, price, category' 
      });
    }

    // Cria o documento no MongoDB
    const newItem = await Item.create({
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      stock: data.stock || 0
    });

    res.status(201).json({
      message: 'Item created',
      data: newItem
    });
  } catch (error) {
    // Tratamento de erros específicos do Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Erro de validação',
        errors: error.errors 
      });
    }
    
    res.status(500).json({ message: error.message });
  }
});

// Example route - Update item
router.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    // TODO: Implement database update
    res.json({ 
      message: `Item ${id} updated`,
      data: data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Example route - Delete item
router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implement database delete
    res.json({ 
      message: `Item ${id} deleted`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
