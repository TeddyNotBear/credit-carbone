import { FileController } from './../controllers/file.controller.js';
import express from "express";
import { SCC } from '../models/scc.model.js';
import { corporateMiddleware } from '../middleware/access.middleware.js';
import { User } from '../models/user.model.js';

const router = express.Router();

router.use(function(_req: any, res: express.Response, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
    next();
});

router.post('/upload', async (req: any, res: express.Response) => {
    try {
        const email = req.body.email;
        const jsonData = req.body.jsonData;
        const type = req.body.type;
        console.log(email);

        const userInfo = await User.findOne({email: email}).exec();
        if (userInfo === null) {
            res.status(404).end();
            return;
        }
        if(userInfo.role === 'Corporate') return res.status(401).end();
        
        if(jsonData) {
            const fileController = new FileController();
            await fileController.generateJsonFiles(jsonData, type, email);
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
    console.log('IPFS');

    console.log('IPFS email:', req.body.email)

    try {
        const email = req.body.email;

        const userInfo = await User.findOne({email: email}).exec();
        if (userInfo === null) {
            res.status(404).end();
            return;
        }
        if(userInfo.role === 'Corporate') return res.status(401).end();

        const jsonData = req.body.jsonData;

        if(jsonData) {
            const fileController = new FileController();
            const ipfsHashesArr = await fileController.uploadToIPFS(jsonData);

            return res.status(200).send({
                message: "Uploaded files to IPFS successfully",
                data: ipfsHashesArr,
            });
        }
        if (jsonData == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }

    } catch (error) {
        res.status(500).send({
            message: `Could not upload the files to IPFS`,
        });
    }
});

router.post('/verif', async (req, res: express.Response) => {
    try {
        const jsonData = req.body.jsonData;
        const email = req.body.email;

        const userInfo = await User.findOne({email: email}).exec();
        if (userInfo === null) {
            res.status(404).end();
            return;
        }
        if(userInfo.role === 'Corporate') return res.status(401).end();

        if(jsonData) {
            const fileController = new FileController();
            const userUCOs = await fileController.getUserUCO(email);
            const isValid: boolean = await fileController.ownershipVerification(userUCOs, jsonData);
            console.log(isValid);
            if(isValid) await fileController.updateUCORetirementStatus(jsonData);

            return res.status(200).send({ message: isValid });
        }
    } catch (error) {
        return res.status(400).send({ message: "You must own the UCOs to associate SCCs with them" });
    }
});

router.put('/scc/putOnSale', async (req, res: express.Response) => {
    const sccId = req.body.sccId;
    if(!sccId) return res.status(500);

    const email = req.body.email;

    const userInfo = await User.findOne({email: email}).exec();
    if (userInfo === null) {
        res.status(404).end();
        return;
    }
    if(userInfo.role === 'Corporate') return res.status(401).end();
    
    try {
        const filter = { id_scc: sccId };
        const update = { onSale: true };
        await SCC.findOneAndUpdate(filter, update, { new: true });
        return res.status(200).send({ message: "Update successfully!"});
    } catch (error) {
        return res.status(400).send({ message: "" });
    }
});

router.put('/scc/removeFromSale', async (req, res: express.Response) => {
    const sccId = req.body.sccId;
    if(!sccId) return res.status(500);

    const email = req.body.email;

    const userInfo = await User.findOne({email: email}).exec();
    if (userInfo === null) {
        res.status(404).end();
        return;
    }
    if(userInfo.role === 'Corporate') return res.status(401).end();
    
    try {
        const filter = { id_scc: sccId };
        const update = { onSale: false };
        await SCC.findOneAndUpdate(filter, update, { new: true });
        return res.status(200).send({ message: "Update successfully!"});
    } catch (error) {
        return res.status(400).send({ message: "" });
    }
});

router.put('/scc/compensate', async (req, res: express.Response) => {
    const sccId = req.body.sccId;
    if(!sccId) return res.status(500);
    
    try {
        const filter = { id_scc: sccId };
        const update = { scc_retirement_status: 'Compensate' };
        await SCC.findOneAndUpdate(filter, update, { new: true });
        return res.status(200).send({ message: "Update successfully!"});
    } catch (error) {
        return res.status(400).send({ message: "" });
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

router.get('/scc/onSale', async (req, res: express.Response) => {
    try {
        const filter = { onSale: true };
        const sccsData = await SCC.find(filter).exec();
        return res.status(200).send(sccsData);
    } catch (error) {
        console.log(error)
    }

});

export { router as fileRouter }