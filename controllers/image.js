const MODEL_ID = 'face-detection';

const returnRequestOptions = (imageURL) => {
  
  // FInd PAT(Personal Access Token) under the accounts section in clarifai
  const PAT = process.env.CLARIFAI_PAT;
  const USER_ID = 'vishal_0719'; 
  const APP_ID = 'smart-brain';
  // Change these to whatever model and image URL you want to use
  const IMAGE_URL = imageURL;
  
  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL,
                }
            }
        }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  return requestOptions;
}

const handleApiCall = (req, res) => {
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", returnRequestOptions(req.body.input))
        .then(response => response.json())
        .then(data => {
            res.json(data)
        })
        .catch(err => res.status(400).json('unable to work with api'))
}


const handleImage = (db, req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries)
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}