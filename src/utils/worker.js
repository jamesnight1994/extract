import { env, pipeline } from '@xenova/transformers';



class ImageQAPipeline {
    // The LLM we will be using 
    static model = 'Xenova/distilbert-base-cased-distilled-squad';
    // The task type we will be running
    static task = 'question-answering';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            env.allowLocalModels = false;
            this.instance = pipeline(this.task, this.model, { progress_callback });
        }

        return this.instance;
    }

}


// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    const { type } = event.data;

    if (type === 'ask') {
        // Retrieve the translation pipeline. When called for the first time,
        // this will load the pipeline and save it for future use.
        const qa = await ImageQAPipeline.getInstance(x => {
            // We also add a progress callback to the pipeline so that we can
            // track model loading.
            self.postMessage(x);
        });

        
        try {
            const { question, context } = event.data;

            // ask question about the context
            const response = await qa(question, context);

            console.log(response);

            // Send the output back to the main thread
            self.postMessage({
                status: 'complete',
                response: response.answer
            });

        } catch (error) {
            console.error(error);
        }

    } 


});
