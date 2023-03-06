const Clarifai = require('clarifai');


const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 25192a1aa1bd438dbd71f5de4aa15d88");


const handleApiCall = (req,res) => {
    
        stub.PostModelOutputs(
            {
                
                user_app_id: {
                    user_id: "ionutily",  // The literal "me" resolves to your user ID.
                    app_id: "my-first-application"
                  },
                // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
                model_id: 'face-detection',
                inputs: [{data: {image: {url: req.body.input}}}]
            },
            metadata,
            (err, response) => {
                if (err) {
                    console.log("Error: " + err);
                    return;
                }

                if (response.status.code !== 10000) {
                    console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                    return;
                }

                console.log("Predicted concepts, with confidence values:")
                for (const c of response.outputs[0].data.concepts) {
                    console.log(c.name + ": " + c.value);
                }
                res.json(response)
            }
        );
};

const handleImage = (req,res,db) =>{
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
    handleImage:handleImage,
    handleApiCall:handleApiCall
}