import React, { useState } from 'react';
import { useGallery } from '../../context/GalleryContext';
import { Upload, Trash2, Save, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const GalleryTab = () => {
  const { images, loading, addGalleryImage, deleteGalleryImage, updateGalleryImageOrder } = useGallery();
  const [newImage, setNewImage] = useState(null);
  const [altText, setAltText] = useState('');
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveImage = async () => {
    if (newImage) {
      const { success } = await addGalleryImage(newImage, altText);
      if (success) {
        setNewImage(null);
        setAltText('');
        setPreview(null);
      }
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      await deleteGalleryImage(id, imageUrl);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateGalleryImageOrder(items);
  };

  return (
    <div>
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-serif mb-4">Add New Image</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Image File</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
            {preview && <img src={preview} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-md" />}
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Alt Text</label>
            <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black" />
          </div>
        </div>
        <button onClick={handleSaveImage} disabled={!newImage} className="mt-4 px-6 py-2 bg-burgundy text-white rounded-md text-xs uppercase tracking-widest hover:bg-burgundy-light disabled:bg-gray-300 flex items-center">
          <Upload size={16} className="mr-2" />
          Upload Image
        </button>
      </div>

      <div>
        <h3 className="text-lg font-serif mb-4">Manage Gallery</h3>
        {loading ? (
          <p>Loading images...</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="gallery-images">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <Draggable key={image.id} draggableId={image.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`relative group bg-white rounded-lg shadow-sm overflow-hidden ${snapshot.isDragging ? 'ring-2 ring-burgundy' : ''}`}
                        >
                          <div {...provided.dragHandleProps} className="absolute top-2 left-2 z-10 p-1 bg-white/50 rounded-full cursor-grab">
                            <GripVertical size={16} className="text-gray-600" />
                          </div>
                          <img src={image.image_url} alt={image.alt_text || ''} className="w-full h-48 object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-xs truncate">
                            {image.alt_text}
                          </div>
                          <button onClick={() => handleDelete(image.id, image.image_url)} className="absolute top-2 right-2 z-10 p-1 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={16} className="text-red-600" />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default GalleryTab;
