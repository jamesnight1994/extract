import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Flex,
  Input
} from "@aws-amplify/ui-react";


const Upload = () => {
  const [, setReady] = useState<boolean |null>(null);
  const [, setDisabled] = useState(false);
  const [, setProgressItems] = useState<any[]>([])
  const [output, setOutput] = useState('');
  // Create a reference to the worker object.
  const worker = useRef<Worker | null>(null);

  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL('../../utils/worker.js', import.meta.url), {
        type: 'module'
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      switch (e.data.status) {

        case 'done':
          // Model file loaded: remove the progress item from the list.
          setProgressItems(
            prev => prev.filter(item => item.file !== e.data.file)
          );
          break;

        case 'ready':
          // Pipeline ready: the worker is ready to accept messages.
          setReady(true);
          break;

        case 'update':
          // Generation update: update the output text.
          setOutput(e.data.output);
          console.info('Output:',output)
          break;

        case 'complete':
          // Generation complete: re-enable the "Translate" button
          setDisabled(false);
          break;
      }
    };

    

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current?.removeEventListener('message', onMessageReceived);
  });

  const handleSubmit = () => {
    setDisabled(true);
    let input = 'Hello there,';
    worker.current?.postMessage({
      text: input,
      src_lang: 'eng_Latn',
      tgt_lang: 'fra_Latn',
    });
    console.log('Translating...')
  }

  

  return (
    <>
      <Flex as="form" direction="column" width="100%">
        <Input
          name="image"
          id="file-upload" type="file" accept="image/*" />


        <Button
          onClick={handleSubmit}
          variation="primary"
          width={{ base: "100%", large: "50%" }}
          style={{ marginLeft: "auto" }}
        >
          Submit
        </Button >
      </Flex>
    </>
  );
};

export default Upload;
