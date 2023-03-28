import { FileController } from './../controllers/file.controller';
import express from "express";

const router = express.Router();

router.use(function(req: any, res: express.Response, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.post('/upload', async (req: any, res: express.Response) => {
    try {
        const jsonData = req.body.jsonData;
        const type = req.body.type;
        const email = req.body.email;
        
        if(jsonData) {
            const fileController = new FileController();
            fileController.generateJsonFiles(jsonData, type, email);
        }
        if (jsonData == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        return res.status(200).send({
            message: "Uploaded files successfully",
        });

    } catch (error) {
        res.status(500).send({
            message: `Could not upload the files`,
        });
    }
});

router.post('/uploadToIPFS', async (req: any, res: express.Response) => {
    try {
        const jsonData = req.body.jsonData;
        if(jsonData) {
            const fileController = new FileController();
            // fileController.uploadToIPFS(jsonData);
        }
        if (jsonData == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        return res.status(200).send({
            message: "Uploaded files to IPFS successfully",
        });

    } catch (error) {
        res.status(500).send({
            message: `Could not upload the files to IPFS`,
        });
    }
});

router.post('/verif', async (req, res: express.Response) => {
    try {
        const jsonData = req.body.jsonData;
        const userEmail = req.body.userEmail;
        if(jsonData) {
            const fileController = new FileController();
            const userUCOs = await fileController.getUserUCO(userEmail);
            const isValid: boolean = await fileController.ownershipVerification(userUCOs, jsonData);

            return res.status(200).send({ message: isValid });
        }
    } catch (error) {
        return res.status(400).send({ message: "You must own the UCOs to associate SCCs with them" });
    }
});

router.get('/uco/user/:userEmail', async (req, res: express.Response) => {
    const userEmail = req.params['userEmail'];
    if(!userEmail) return res.status(500).send({ message: "Please enter an email!"});

    try {
        // Check if user exists or return error
        const fileController = new FileController();
        const userUCO = await fileController.getUserUCO(userEmail);
        return res.status(200).send(userUCO);
    } catch (error) {
        console.log(error)
    }

});

router.get('/scc/user/:userEmail', async (req, res: express.Response) => {
    const userEmail = req.params['userEmail'];
    if(!userEmail) return res.status(500).send({ message: "Please enter an email!"});

    try {
        // Check if user exists or return error
        const fileController = new FileController();
        const userSCC = await fileController.getUserSCC(userEmail);
        return res.status(200).send(userSCC);
    } catch (error) {
        console.log(error)
    }

});

export { router as fileRouter }