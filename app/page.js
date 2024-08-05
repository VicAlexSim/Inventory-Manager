'use client'
import Image from "next/image";
import { useState, useEffect } from 'react'
import { firestore } from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button, Paper, IconButton } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import '@fontsource/press-start-2p'; // Pixelated font

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State to manage search query

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 })
    }
    else {
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Filter inventory based on search query
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        padding: 4,
        backgroundImage: 'url("https://wallpapers.com/images/high/minecraft-inventory-u5zq2gh4e33whqcv.webp")', // Minecraft background
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: '"Press Start 2P", cursive',
        color: '#fff',
      }}
    >
      <Typography
        variant="h2"
        sx={{
          marginBottom: 4,
          padding: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: 1,
          textAlign: 'center',
        }}
      >
        Inventory Manager
      </Typography>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          marginBottom: 2,
          backgroundColor: '#4CAF50',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#45a049',
          },
        }}
      >
        Add New Item
      </Button>
      <TextField
        variant="outlined"
        placeholder="Search items"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          maxWidth: 800,
          marginBottom: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 1,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#fff',
            },
            '&:hover fieldset': {
              borderColor: '#fff',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#fff',
            },
          },
          input: {
            color: '#000',
          },
        }}
      />
      <Paper elevation={3} sx={{
        maxWidth: 800,
        width: '100%',
        padding: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 1,
      }}>
        <Typography
          variant="h4"
          sx={{ marginBottom: 2, textAlign: 'center', color: "#FFFFFF" }}
        >
          Items in Inventory
        </Typography>
        <Stack
          spacing={2}
          sx={{ maxHeight: 300, overflowY: 'auto' }}
        >
          {filteredInventory.map(({ name, quantity }) => (
            <Paper
              key={name}
              elevation={1}
              sx={{
                padding: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 1,
              }}
            >
              <Typography
                variant="h6"
                color="textPrimary"
                sx={{ textAlign: 'center' }}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant="h6"
                color="textPrimary"
                sx={{ textAlign: 'center' }}
              >
                {quantity}
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton
                  sx={{ color: '#4CAF50' }}
                  onClick={() => addItem(name)}
                >
                  <AddCircleIcon />
                </IconButton>
                <IconButton
                  sx={{ color: '#F44336' }}
                  onClick={() => removeItem(name)}
                >
                  <RemoveCircleIcon />
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Paper>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="background.paper"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
            borderRadius: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
          }}
        >
          <Typography variant="h6" color="#FFF">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#fff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#fff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                  },
                },
                input: {
                  color: '#000',
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#4CAF50',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#45a049',
                },
              }}
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  )
}
