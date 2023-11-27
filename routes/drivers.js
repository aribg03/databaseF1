const {Router} = require('express');
const { driversList, listDriverByRef, addDriver, modDriver, deleteDriver, listDriverByCode } = require('../controllers/drivers');


const router = Router();

router.get('/', driversList);
router.get('/:driverRef', listDriverByRef);
router.post('/:code', listDriverByCode)
router.put('/',addDriver);
router.patch('/:driverId',modDriver);
router.delete('/:driverId',deleteDriver);

module.exports = router;