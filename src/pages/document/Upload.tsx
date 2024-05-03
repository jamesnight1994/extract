import React, {  } from "react";
import {
  Button,
  Flex,
  Input
} from "@aws-amplify/ui-react";


const Upload = () => {

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    console.log('Name:', name);
    console.log('Value:', value)
  };

  const handleSubmit = (e) => {
    /// validate ...
    e.preventDefault();
  };

  return (
    <>
      <Flex as="form" direction="column" width="100%" onSubmit={handleSubmit}>
        <Input
          onChange={handleInputChange}
          name="image"
          id="file-upload" type="file" accept="image/*" />


        <Button
          type="submit"
          variation="primary"
          width={{ base: "100%", large: "50%" }}
          style={{ marginLeft: "auto" }}
        >
          Submit
        </Button>
      </Flex>
    </>
  );
};

export default Upload;
