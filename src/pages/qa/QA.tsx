import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Flex,
  Input,
  Loader,
  Label,
  TextAreaField
} from "@aws-amplify/ui-react";

const Upload = () => {

  // Model loading
  const [ready, setReady] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState(`Facts about James:

  James Ng'ang'a is a well-rounded software engineer of 6 years, with expertise in full-stack development and DevOps.
  He specializes in creating ETL pipelines and integrating them with applications to support various business operations.
  Skills:
  Building web applications around ETL pipelines and integrating them with event-driven servers like Kafka.
  Visualizing data using optimized queries on platforms such as Power BI and Quicksight.
  Implementing and fine-tuning open-source AI models using business data.
  Technologies used:
  Software Development: Express.js, Django, MySQL, and Postgres.
  Data Engineering: Python, Power BI, SQL, MySQL, and Postgres.
  His professional experience demonstrates his ability to tackle complex technical challenges across various domains, making him a versatile and valuable asset in software engineering and data engineering roles.`);
  const [answer, setAnswer] = useState()
  const [progressItems, setProgressItems] = useState([]);

  // Inputs and outputs
  const [output, setOutput] = useState('');


  const worker = useRef<Worker>(null);
  const exampleContext = 

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

      {/* Context & question form */}
      <Flex as="form" direction="column" width="100%">
        <Label>Question:</Label>
        <Input name="question" onChange={(e) => setQuestion(e.target.value)} />
        <TextAreaField value={context} label="Context" size="large" onChange={(e) => setContext(e.target.value)}  />
        <Button disabled={disabled} type="submit" onClick={handleSubmit} variation="primary" width="100%" style={{ marginLeft: "auto" }}>
          Submit
        </Button>
      </Flex>

      {/* loading model files progress */}
      {ready === false && (
        <label>Loading models...</label>
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
