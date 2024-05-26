import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Flex,
  Input,
  Image,
  Loader,
  Label,
  TextField,
  TextAreaField
} from "@aws-amplify/ui-react";

const Upload = () => {
  const [, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  // Model loading
  const [ready, setReady] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [answer, setAnswer] = useState()
  const [progressItems, setProgressItems] = useState([]);

  // Inputs and outputs
  const [output, setOutput] = useState('');


  const worker = useRef<Worker>(null);

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
        case 'initiate':
          // Model file start load: add a new progress item to the list.
          setReady(false);
          setProgressItems(prev => [...prev, e.data]);
          break;

        case 'progress':
          // Model file progress: update one of the progress items.
          setDisabled(true);
          setProgressItems(
            prev => prev.map(item => {
              if (item.file === e.data.file) {
                return { ...item, progress: e.data.progress }
              }
              return item;
            })
          );
          break;

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
          break;

        case 'complete':
          // Generation complete: re-enable the "Submit" button
          setAnswer(e.data.response);
          setDisabled(false);
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener('message', onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => worker.current.removeEventListener('message', onMessageReceived);
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
    event.preventDefault();
    worker.current.postMessage({
      type: 'ask',
      question: question,
      context: context
    })

  }

  return (
    <>

      {/* Upload question & document form */}
      <Flex as="form" direction="column" width="100%">
        <Label>Question:</Label>
        <Input name="question" onChange={(e) => setQuestion(e.target.value)} />
        <TextAreaField  label="Context" size="large" onChange={(e) => setContext(e.target.value)}  />
        <Button disabled={disabled} type="submit" onClick={handleSubmit} variation="primary" width="100%" style={{ marginLeft: "auto" }}>
          Submit
        </Button>
      </Flex>

      {/* Preview image  */}
      {
        previewURL
        && <Image
          alt="Amplify logo"
          src={previewURL}
          objectFit="initial"
          backgroundColor="initial"
          marginTop="10%"
          marginRight="50%"
          height="350px"
        />
      }

      {/* loading model files progress */}
      {ready === false && (
        <label>Loading models... (only run once)</label>
      )}
      {progressItems.map(data => (
        <div>
          <label>{data.file} (only run once)</label>
          <Loader width="100%" variation="linear" percentage={data.progress} isDeterminate={true} />
        </div>
      ))}

      {/* If there is a question but no answer */}
      {(disabled && !answer) && (
        <Loader size="large" />
      )}

      {/* If there is an answer */}
      {answer && (
        <Label marginTop={20}>The answer is: {answer}</Label>
      )}


    </>
  );
};

export default Upload;
