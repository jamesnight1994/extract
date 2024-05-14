import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Flex,
  Input
} from "@aws-amplify/ui-react";


const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const worker = useRef(null);

  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('../../utils/worker.js', import.meta.url), {
        type: 'module'
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = () => {
      // TODO: Will fill in later
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('Model message:', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener('Model message:', onMessageReceived);
  });



  const onFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Optional: Handle image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewURL(null); // Clear preview if no file selected
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    if (!selectedFile) {
      // Handle error or notification if no file is selected
      console.error('Please select an image to upload');
      return; // Early return to prevent unnecessary processing
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const arrayBuffer = reader.result; // Assuming the file is small enough
      

      worker.current.postMessage(arrayBuffer);

      // Handle worker responses (if applicable)
      worker.current.onmessage = (event) => {
        console.log('Worker message:', event.data);
      };
    };
    reader.readAsArrayBuffer(selectedFile);
  };



  return (
    <>
      <Flex as="form" direction="column" width="100%" onSubmit={handleSubmit}>
        <Input name="image" type="file" accept="image/*" onChange={onFileChange} />

        <Button type="submit" variation="primary" width={{ base: "100%", large: "50%" }} style={{ marginLeft: "auto" }}>
          Submit
        </Button>
      </Flex>
      {previewURL && <img src={previewURL} alt="Uploaded preview" />} {/* Optional preview */}
    </>
  );
};

export default Upload;
