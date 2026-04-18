import React, { useState } from 'react';
import { useGallery } from '../../context/GalleryContext';
import { Upload, Trash2, Save, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const GalleryTab = () => {
  const { media, loading, addGalleryMedia, deleteGalleryMedia, updateGalleryMediaOrder } = useGallery();
  const [newMedia, setNewMedia] = useState(null);
  const [altText, setAltText] = useState('');
  const [preview, setPreview] = useState(null);
  const [mediaType, setMediaType] = useState('file'); // 'file' or 'youtube'
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSaveMedia = async () => {
    if (mediaType === 'file' && newMedia) {
      const { success } = await addGalleryMedia(newMedia, altText, 'file');
      if (success) {
        setNewMedia(null);
        setAltText('');
        setPreview(null);
      }
    } else if (mediaType === 'youtube' && youtubeUrl) {
      const videoId = getYouTubeId(youtubeUrl);
      if (!videoId) {
        alert('Invalid YouTube URL. Please check the link and try again.');
        return;
      }
      const { success } = await addGalleryMedia(videoId, altText, 'youtube');
      if (success) {
        setYoutubeUrl('');
        setAltText('');
      }
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMedia(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDelete = async (id, mediaUrl) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteGalleryMedia(id, mediaUrl);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(media);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateGalleryMediaOrder(items);
  };

  return (
    <div>
      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-serif mb-4">Add New Media</h3>
        <div className="flex items-center mb-4">
          <input type="radio" id="file" name="mediaType" value="file" checked={mediaType === 'file'} onChange={() => setMediaType('file')} className="mr-2" />
          <label htmlFor="file" className="mr-4">Upload File</label>
          <input type="radio" id="youtube" name="mediaType" value="youtube" checked={mediaType === 'youtube'} onChange={() => setMediaType('youtube')} className="mr-2" />
          <label htmlFor="youtube">YouTube URL</label>
        </div>
        <p className="text-sm text-gray-500 mb-4">Files larger than 100MB can be uploaded using YouTube links.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mediaType === 'file' ? (
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Media File</label>
              <input type="file" accept="image/*,video/*" onChange={handleMediaChange} className="w-full" />
              {preview && (
                <div className="mt-4 w-32 h-32 bg-gray-100 rounded-md overflow-hidden">
                  {newMedia.type.startsWith('video') ? (
                    <video src={preview} controls className="w-full h-full object-cover" />
                  ) : (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">YouTube URL</label>
              <input type="text" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black" />
            </div>
          )}
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Alt Text</label>
            <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-black" />
          </div>
        </div>
        <button onClick={handleSaveMedia} disabled={!newMedia && !youtubeUrl} className="mt-4 px-6 py-2 bg-burgundy text-white rounded-md text-xs uppercase tracking-widest hover:bg-burgundy-light disabled:bg-gray-300 flex items-center">
          <Upload size={16} className="mr-2" />
          Upload Media
        </button>
      </div>

      <div>
        <h3 className="text-lg font-serif mb-4">Manage Gallery</h3>
        {loading ? (
          <p>Loading media...</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="gallery-media" direction="horizontal">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap -m-2">
                  {media.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5`}
                        >
                          <div
                            className={`relative group bg-white rounded-lg shadow-sm overflow-hidden ${
                              snapshot.isDragging ? 'ring-2 ring-burgundy' : ''
                            }`}>
                            <div className="absolute top-2 left-2 z-10 p-1 bg-white/50 rounded-full cursor-grab pointer-events-none">
                              <GripVertical size={16} className="text-gray-600" />
                            </div>
                            {item.media_type === 'youtube' ? (
                              <img src={`https://img.youtube.com/vi/${item.image_url}/0.jpg`} alt={item.alt_text || ''} className="w-full h-48 object-cover" />
                            ) : item.media_type === 'video' ? (
                              <video src={item.image_url} className="w-full h-48 object-cover" />
                            ) : (
                              <img src={item.image_url} alt={item.alt_text || ''} className="w-full h-48 object-cover" />
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-xs truncate">
                              {item.alt_text}
                            </div>
                            <button 
                              onClick={() => handleDelete(item.id, item.image_url)}
                              onMouseDown={(e) => e.stopPropagation()}
                              className="absolute top-2 right-2 z-10 p-1 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
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
