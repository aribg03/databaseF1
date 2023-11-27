const {request, response} = require('express');
const driversModel = require('../models/drivers');
const pool = require('../db');


const driversList = async (req = request, res = response) => {
    let conn;
    try{
        conn =await pool.getConnection();
        const drivers = await conn.query(driversModel.getAll, (err) =>{
            if (err) {
                throw new Error(err);
            }
        }) 
        res.json(drivers);
    }catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }
}

const listDriverByRef = async (req = request, res = response) => {
    const {driverRef} = req.params;

    let conn;
    try{
        conn = await pool.getConnection();

        const [driverR] = await conn.query(driversModel.getByRef, [driverRef], (err) => {
            if (err) {
                throw new Error (err);
            }
        }) 

        if (!driverR) {
            res.status(404).json({msg:'ID reference not found'});
            return;
        }
        res.json(driverR);
    }catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }
}

const listDriverByCode = async (req = request, res = response) => {
    const {code} = req.params;

    let conn;
    try{
        conn = await pool.getConnection();

        const [driver] = await conn.query(driversModel.getByCode, [code], (err) => {
            if (err) {
                throw new Error (err);
            }
        }) 

        if (!driver) {
            res.status(404).json({msg:'Code not found'});
            return;
        }
        res.json(driver);
    }catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }
}

const addDriver = async (req = request, res = response) => {
    const {driverRef, number, code, forename, surname, dob, nationality, url} = req.body;

    if (!driverRef || !number || !code || !forename || !surname || !dob || !nationality || !url){
        res.status(400).json({msg:'Missing information'});
        return
    }
    
    const driver = [driverRef, number, code, forename, surname, dob, nationality, url];
    let conn;

    try{
        conn = await pool.getConnection();

        const [namesExisting] = await conn.query(
            driversModel.getByNames, [forename, surname],
            (err) => {if (err) throw err;}
        );
        if (namesExisting) {
            res.status(409).json({msg: `Driver with surname ${surname} and forename ${forename} already exists`});
            return
        }

        const driverAdded = await conn.query(
            driversModel.addDriver,
            [...driver], 
            (err) => {if (err) throw err;}
        )

        if (driverAdded.affectedRows === 0) throw new Error ({msg: 'Failed to add driver'});
        
        res.json({msg:'Driver added succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}

const modDriver = async (req = request, res = response) => {
    const {driverRef, number, code, forename, surname, dob, nationality, url} = req.body;

    if (!driverRef || !number || !code || !forename || !surname || !dob || !nationality || !url){
        res.status(400).json({msg:'Missing information'});
        return
    }

    const driver = [driverRef, number, code, forename, surname, dob, nationality, url];
    let conn;

    try {        
        conn = await  pool.getConnection();
        
        const {driverId} = req.params;
        const [idExisting] = await conn.query(
            driversModel.getById, [driverId],
            (err) => {if (err) throw err;}
        );
        if (!idExisting) {
            res.status(409).json({msg: `Driver not found`});
            return
        }

        const [namesExisting] = await conn.query(
            driversModel.getByNames, [forename, surname],
            (err) => {if (err) throw err;}
        );
        if (namesExisting) {
            res.status(409).json({msg: `Driver with surname ${surname} and forename ${forename} already exists`});
            return
        }
        
        const driverModified = await conn.query(
            driversModel.modDriver,
            [...driver, driverId], 
            (err) => {if (err) throw err;}
        )

        if (driverModified.affectedRows === 0) throw new Error ({msg: 'Failed to modify driver'});
        
        res.json({msg:'Driver modified succesfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally {
        if (conn) conn.end();
    }
}

const deleteDriver = async (req = request, res = response) => {
    let conn;

    try {
        conn = await pool.getConnection();
        const {driverId} = req.params;

        const [idExisting] = await conn.query(
            driversModel.getById,
            [driverId],
            (err) => {if (err) throw err;}
        )

        if (!idExisting) {
            res.status(404).json({msg:'ID not found'});
            return;
        }
        
        const driverDeleted = await conn.query(
            driversModel.deleteDriver,
            [driverId],
            (err) => {if (err) throw err;}
        )

        if (driverDeleted.affectedRows === 0) {
            throw new Error({msg: 'Failed to delete driver'})
        };

        res.json({msg: 'Driver deleted succesfully'});
    } catch (error) {
        console.log(error);
            res.status(500).json(error);
        } finally {
            if (conn) conn.end();
    }
}

module.exports = {driversList, listDriverByRef, listDriverByCode, addDriver, modDriver, deleteDriver};