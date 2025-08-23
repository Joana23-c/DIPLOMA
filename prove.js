const run = async()=>{


    
    const stream = await navigator.mediaDevices.getUserMedia({
        video:true,
        audio: false,

    });
    const videoFeedEl = document.getElementById('video-feed')
    videoFeedEl.srcObject = stream
    await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('../face-api-js-starter-main/public/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('../face-api-js-starter-main/public/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('../face-api-js-starter-main/public/models'),
        faceapi.nets.ageGenderNet.loadFromUri('../face-api-js-starter-main/public/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('../face-api-js-starter-main/public/models')
    ]);

    const canvas = document.getElementById('canvasface');
    const updateCanvasDimensions = () => {
        canvas.style.left = `${videoFeedEl.offsetLeft}px`;
        canvas.style.top = `${videoFeedEl.offsetTop}px`;
        canvas.height = videoFeedEl.videoHeight;
        canvas.width = videoFeedEl.videoWidth;
    };

    updateCanvasDimensions();

    window.addEventListener('resize', updateCanvasDimensions);
    

    setInterval(async()=>{
        let faceAIData = await faceapi.detectAllFaces(videoFeedEl)
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withAgeAndGender()
        .withFaceExpressions();
        console.log(faceAIData)

        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
        faceAIData = faceapi.resizeResults(faceAIData, videoFeedEl);

        // faceapi.draw.drawDetections(canvas,faceAIData)
        //  faceapi.draw.drawFaceLandmarks(canvas,faceAIData);
        // faceapi.draw.drawFaceExpressions(canvas,faceAIData);

    let emotionText = "";

         faceAIData.forEach(face => {
        //      const{age, gender, genderProbability} = face
        //      const genderText = `${gender} - ${Math.round(genderProbability*100)/100*100}`
        //  const ageText =`${Math.round(age)} vjec`
        // const textField = new faceapi.draw.DrawTextField(
        //     [genderText, ageText],  // Text to display
        //      face.detection.box.topRight // Position
        //  )
        const expressions = face.expressions;
        const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
        const topEmotion = sorted[0][0];

        switch (topEmotion) {
            case 'happy':
                allhappyCount++
                happyCount++;
                break;
            case 'sad':
                allsadCount++;
                sadCount++;
                break;
            case 'disgusted':
                alldisgustedCount++;
                break;
            case 'angry':
                allangryCount++;
                break;
            case 'neutral':
                allneutralCount++;
                break;
            case 'surprised':
                allsurprisedCount++;
                break;
        } 

        if(happyCount==10){
           velocityx = -5; 
           console.log("ke be 10 happy");
        }
        else if(happyCount==30){
           velocityx = -6; 
           console.log("ke be 30 happy");
            happyCount=0;
        }
        else if(sadCount==5 && velocityx!=-4){
           velocityx = -4; 
           console.log("ke be 5 sad");
            sadCount=0;
            happyCount=0;
        }
        // else if(fearfulCount==10){
        //     window.alert("10 fearefull");
        // }
        emotionText += `Emocion: ${topEmotion}<br>`;
     })
    },1000)
} 
 