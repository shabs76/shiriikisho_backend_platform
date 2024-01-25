import _ from "lodash";
import authDbObj from "../dbQueries/index.js";
import { mainActsClass } from "../../req/main.js";
import moment from 'moment'

class AdminGetter extends mainActsClass {
    constructor(){
        super();
    }

    getRegionsList = async () => {
        const regsx = await authDbObj.selectRegionsDetails();
        if (!_.isArray(regsx)) {
            this.Mlogger.error(regsx);
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching regions'
            }
            return er;
        } else if (_.isArray(regsx) && _.isEmpty(regsx)) {
            const er = {
                state: 'error',
                data: 'Hakuna mkoa unayotoa huduma kwa sasa. Tafadhali jaribu baadae'
            }
            return er;
        }

        const sc = {
            state: 'success',
            data: regsx
        }
        return sc;
    }

    getDistrictList = async () => {
        const distx = await authDbObj.selectDistrictDetails();
        if (!_.isArray(distx)) {
            this.Mlogger.error(distx);
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching districts'
            }
            return er;
        } else if (_.isArray(distx) && _.isEmpty(distx)) {
            const er = {
                state: 'error',
                data: 'Hakuna wilaya inayotoa huduma kwa sasa. Tafadhali jaribu baadae'
            }
            return er;
        }

        const sc = {
            state: 'success',
            data: distx
        }
        return sc;
    }

    getWardsList = async () => {
        const wards = await authDbObj.selectWardsDetails();
        if (!_.isArray(wards)) {
            this.Mlogger.error(wards);
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching districts'
            }
            return er;
        } else if (_.isArray(wards) && _.isEmpty(wards)) {
            const er = {
                state: 'error',
                data: 'Hakuna inayo inayotoa huduma kwa sasa. Tafadhali jaribu baadae'
            }
            return er;
        }

        const sc = {
            state: 'success',
            data: wards
        }
        return sc;
    }


    getParkAreaList = async (searchTerm = '', sql = " `park_id` != ? ") => {
        const parks = await authDbObj.selectParkAreasDetails([searchTerm, 'active', 'blocked'], sql+" AND (`status` = ? OR `status` = ?)");
        if (!_.isArray(parks)) {
            this.Mlogger.error(parks);
            const er = {
                state: 'error',
                data: 'An error occurred while fetching parking areas'
            }
            return er;
        } else if (_.isArray(parks) && _.isEmpty(parks)) {
            const er = {
                state: 'success',
                data: []
            }
            return er;
        }
        const parkList = [];
        // get other details of the park
        for (let index = 0; index < parks.length; index++) {
            const park = parks[index];
            // get vehicle type of Park
            const vehicleInf = await authDbObj.selectVehiclesTypesDetails([park.vehicle_type]);
            if (!_.isArray(vehicleInf)) {
                this.Mlogger.error(vehicleInf);
                park.vehicleName = 'error';
            } else if (_.isArray(vehicleInf) && _.isEmpty(vehicleInf)) {
                park.vehicleName = 'data error';
            }
            park.vehicleName = vehicleInf[0].v_type_name;
            // get leaders
            const leadersInfo = await authDbObj.selectParkLeadersData([park.park_id], " `park_id` = ? ");
            if (!_.isArray(leadersInfo)) {
                this.Mlogger.error(leadersInfo);
                park.leadersInfo = 'error';
            } else if (_.isArray(leadersInfo) && _.isEmpty(leadersInfo)) {
                park.leadersInfo = [];
            } else {
                park.leadersInfo = leadersInfo;
            }
            // get location details
            const locDet = await authDbObj.selectAllLocationDetailsUsingWard([park.ward]);
            if (!_.isArray(locDet)) {
                this.Mlogger.error(locDet);
                park.location = 'error';
            } else if (_.isArray(locDet) && _.isEmpty(locDet)) {
                park.location = 'data asign error'
            } else {
                park.location = locDet[0]
            }
            parkList.push(park);
        };
        const sc = {
            state: 'success',
            data: parkList
        }
        return sc;
    }

    getVehiclTypesList = async () => {
        const vehicles = await authDbObj.selectVehiclesTypesDetails([''], " `v_type_id` != ?");
        if (!_.isArray(vehicles)) {
            this.Mlogger.error(vehicles);
            const er = {
                state: 'error',
                data: 'An error occurred while fetching vehicles types'
            }
            return er;
        } else if (_.isArray(vehicles) && _.isEmpty(vehicles)) {
            const er = {
                state: 'error',
                data: 'Hakuna ina ya chombo kwenye mtandao kwa sasa. Tafadhali jaribu tena baadae'
            }
            return er;
        }

        const sc = {
            state: 'success',
            data: vehicles
        }
        return sc;
    }

    getMetricsData = async () => {
        // get parks number
        const fnRes = { parks: 0, drivers: 0, male: 0, female: 0, active: 0, inactive: 0 }
        const ParksN = await authDbObj.selectParkNumbers(['active'], " `status` = ? ");
        if (!_.isArray(ParksN)) {
            this.Mlogger.error(ParksN);
        } else {
            fnRes.parks = ParksN[0].parks;
        }
        // get total driver numbers
        const driverTots = await authDbObj.selectDriverNumbers(['deleted'], " `status` != ? ");
        if (!_.isArray(driverTots)) {
            this.Mlogger.error(driverTots);
        } else {
            fnRes.drivers = driverTots[0].drivers;
        }

        // get inactive drivers
        const inDrivers = await authDbObj.selectDriverNumbers(['blocked', 'created'], " ( `status` = ?  OR `status` = ? ) ");
        if (!_.isArray(inDrivers)) {
            this.Mlogger.error(inDrivers);
        } else {
            fnRes.inactive = inDrivers[0].drivers;
        }

        fnRes.active = fnRes.drivers - fnRes.inactive;

        // get male drivers
        const maleDrivers = await authDbObj.selectDriverNumbers(['deleted', 'Mwanamume', 'Male'], " `status` != ? AND ( `gender` = ? OR `gender` = ? )");
        if (!_.isArray(maleDrivers)) {
            this.Mlogger.error(maleDrivers);
        } else {
            fnRes.male = maleDrivers[0].drivers;
        }

        // get female drivers
        const fDrivers = await authDbObj.selectDriverNumbers(['deleted', 'Mwanamke', 'Female'], " `status` != ? AND ( `gender` = ? OR `gender` = ? )");
        if (!_.isArray(fDrivers)) {
            this.Mlogger.error(fDrivers);   
        } else {
            fnRes.female = fDrivers[0].drivers;
        }

        return fnRes;
    }

    getDriversDistrictsDistribution = async () => {
        // get drivers based on the districs male and female
        const dists = await authDbObj.selectDistrictDetails();
        if (!_.isArray(dists)) {
            this.Mlogger.error(dists)
            const er = {
                state: 'error',
                data: 'Unable to get districs-drivers details'
            }
            return er;
        } else if (_.isArray(dists) && _.isEmpty(dists)) {
            const suc = {
                state: 'success',
                data: {
                    xData: ['No-dist'],
                    yData: { fData: [0], mData: [0] }
                }
            }
            return suc;
        }

        const res = {
            xData: [],
            yData: {fData: [], mData: []}
        };

        for (let lvGOD = 0; lvGOD < dists.length; lvGOD++) {
            const ditx = dists[lvGOD];
            res.xData.push(ditx.district_name);
            // search numbers
            const fDrivers = await authDbObj.selectDriversNumberBasedOnMajorLocationNames([ditx.district_name, 'Mwanamke', 'Female'], " `district_name` = ? AND ( `gender` = ? OR `gender` = ? )");
            if (!_.isArray(fDrivers)) {
                this.Mlogger.error(fDrivers);
                res.yData.fData.push(0.5);
                continue;
            }
            res.yData.fData.push(fDrivers[0].drivers);
            // search for males
            const mDrivers = await authDbObj.selectDriversNumberBasedOnMajorLocationNames([ditx.district_name, 'Mwanamume', 'Male'], " `district_name` = ? AND ( `gender` = ? OR `gender` = ? )");
            if (!_.isArray(mDrivers)) {
                this.Mlogger.error(mDrivers);
                res.yData.mData.push(0.5);
                continue;
            }
            res.yData.mData.push(mDrivers[0].drivers); 
        }

        const sc = {
            state: 'success',
            data: res
        }
        return sc;
    }

    getTopParkingAreas = async () => {
        const topParkx = [ 
            { park_name: 'notset', members: 0 },
            { park_name: 'notset', members: 0 },
            { park_name: 'notset', members: 0 },
            { park_name: 'notset', members: 0 } 
        ];
        const topParks = await authDbObj.selectParkAreasDetails(['active'], " `status` = ? ORDER BY last_driver_number DESC LIMIT 0, 4");
        if (!_.isArray(topParks)) {
            this.Mlogger.error(topParks);
            return topParkx;
        } else if (_.isArray(topParks) && _.isEmpty(topParks)) {
            return topParkx;
        }
        // now get numbers base on the park id
        const prakes = [];
        for (let index = 0; index < topParks.length; index++) {
            const park = topParks[index];
            const driversN = await authDbObj.selectDriverNumbers(['active', 'created', park.park_id], " (`status` = ? OR `status` = ?) AND `park_area` = ? ");
            if (!_.isArray(driversN)) {
                this.Mlogger.error(driversN);
                prakes.push({ park_name: park.park_name, members: 0.5 })
            } else {
                prakes.push({ park_name: park.park_name, members: driversN[0].drivers })
            }
        }

        return prakes;
    }

    getMonthlyNumbers = async () => {
        const currentDate = moment();
        const mDrivers = await authDbObj.selectDriverNumberMontly([currentDate.subtract(12, 'months').format('YYYY-MM-DD')]);
        if (!_.isArray(mDrivers)) {
            this.Mlogger.error(mDrivers);
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching monthly registration'
            }
            return er;
        } else if (_.isArray(mDrivers) && _.isEmpty(mDrivers)) {
            const exAns = [
                { month: 'Jan', drivers: 0 }
            ];
            const sc = {
                state: 'success',
                data: exAns
            }
            return sc;
        }
        // loop to feed answer to the 
        const shortMonthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const monDrivers = [];
        for (let index = 0; index < mDrivers.length; index++) {
            const driver = mDrivers[index];
            monDrivers.push({ month: shortMonthNames[driver.month - 1], drivers: driver.drivers });
        }

        const suc = {
            state: 'success',
            data: monDrivers
        }

        return suc;
    }


    getDriverWithSearch = async (searchTerm = '', limitz = '') => {
        let qlx = "(`fname` LIKE ? OR `phone` LIKE ? OR `phone` = ? OR `park_name` LIKE ? OR `ward_name` = ?  OR `park_area` = ?)";
        let whereArr = [`${searchTerm}%`, `${searchTerm}%`, searchTerm, `${searchTerm}%`, searchTerm, searchTerm, 'active', 'created'];
        if (searchTerm === '') {
            qlx = "(`fname` != ? OR `phone` != ? OR `park_area` != ?)";
            whereArr = [searchTerm, searchTerm, searchTerm, 'active', 'created'];
        }
        
        const driverInf = await authDbObj.selectDriversBasedOnMajorLocationNames(whereArr, " "+qlx+"  AND (drivers.status = ? OR drivers.status = ?) "+limitz);
        if (!_.isArray(driverInf)) {
            this.Mlogger.error(driverInf);
            const er = {
                state: 'error',
                data: 'An error occurred while fetching driver details',
            }
            return er;
        } else if (_.isArray(driverInf) && _.isEmpty(driverInf)) {
            const er = {
                state: 'success',
                data: [],
            }
            return er;
        }
        const driversList = [];
        for (let index = 0; index < driverInf.length; index++) {
            const driverOb = driverInf[index];
            // delete password data 
            if (typeof (driverOb.password) === 'string') {
                delete driverOb.password;
            }
            // get park information park_area
            const pakInf = await this.getParkAreaList(driverOb.park_area, " `park_id` = ? ");
            if (pakInf.state !== 'success') {
                return pakInf;
            } else if (!_.isArray(pakInf.data) || _.isEmpty(pakInf.data)) {
                const er = {
                    state: 'error',
                    data: 'Driver '+driverOb.driver_id+' is missing parking area'
                }
                return er;
            }
            const parkInf = pakInf.data[0];
            driverOb.parkingInfo = pakInf.data[0];
            // get driver uniform details
            const uniformDet = await authDbObj.selectUniformDetails([driverOb.driver_id, 'active'], " `driver_id` = ? AND `status` = ? ");
            if (!_.isArray(uniformDet)) {
                this.Mlogger.error(uniformDet);
                driverOb.uniform = 'an error ecountered';
            } else if(_.isArray(uniformDet) && _.isEmpty(uniformDet)) {
                driverOb.uniform = 'Unverified';
            } else {
                driverOb.uniform = uniformDet[0].uniform_num;
            }

            // now get leadership information if exits
            const ledInf = await authDbObj.selectParkLeaders([driverOb.driver_id, 'active'], " `driver_id` = ? AND `status` = ? ");
            if (!_.isArray(ledInf)) {
                this.Mlogger.error(ledInf);
                const er = {
                    state: 'error',
                    data: 'An error has occurred while fetching leadership information'
                }
                return er;
            } else if(_.isArray(ledInf) && _.isEmpty(ledInf)) {
                driverOb.parkName = parkInf.park_name;
                driverOb.leadership = 'Member';

                driverOb.leaderState = 'no';
                driversList.push(driverOb);
            } else {
                // now fetch leadership type
                const letyNames = await authDbObj.selectLeaderTypes([ledInf[0].leader_type]);
                if (!_.isArray(letyNames)) {
                    this.Mlogger.error(letyNames);
                    driverOb.parkName = parkInf.park_name;
                    driverOb.leadership = 'Leader';
                    driverOb.leaderState = 'yes';
                    driversList.push(driverOb);

                } else if (_.isArray(letyNames) && _.isEmpty(letyNames)) {
                    this.Mlogger.error(`Driver of id ${driverOb.driver_id} has unknown leadership type`);
                    driverOb.parkName = parkInf.park_name;
                    driverOb.leadership = 'Leader';
                    driverOb.leaderState = 'yes';
                    driversList.push(driverOb);
                }

                driverOb.parkName = parkInf.park_name;
                driverOb.leadership = letyNames[0].type_name;
                driverOb.leaderState = 'yes';
                driversList.push(driverOb);
            }
            
        }

        const sc = {
            state: 'success',
            data: driversList
        }
        return sc;
        
    }






    getInitSystemAdimInfo = async () => {
        const regList = await this.getRegionsList();
        if (regList.state !== 'success') {
            this.Mlogger.error(regList);
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching regions'
            }
            return er;
        }
        const distList = await this.getDistrictList();
        if (distList.state !== 'success') {
            this.Mlogger.error(distList);
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching districts'
            }
            return er;
        }

        const wardList = await this.getWardsList();
        if (wardList.state !== 'success') {
            this.Mlogger.error(wardList);
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching wards'
            }
            return er;
        }

        const ParkList = await this.getParkAreaList();
        if (ParkList.state !== 'success') {
            this.Mlogger.error(ParkList);
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching parks'
            }
            return er;
        }

        const driverList = await this.getDriverWithSearch('', ' ORDER BY driver_date DESC LIMIT 0, 80');
        if (driverList.state !== 'success') {
            this.Mlogger.error(driverList);
            return driverList;
        }

        const monthRegi = await this.getMonthlyNumbers();
        if (monthRegi.state !== 'success') {
            return monthRegi;
        }

        const leadershipTypes = await authDbObj.selectLeaderTypes([''], " `type_id` != ?");
        if (!_.isArray(leadershipTypes)) {
            this.Mlogger.error(leadershipTypes);
            const er = {
                state: 'error',
                data: 'Missing leaderships types information check logs'
            }
            return er;
        }

        const vehiclesTypes = await authDbObj.selectVehiclesTypesDetails([''], " `v_type_id` != ? ");
        if (!_.isArray(vehiclesTypes)) {
            this.Mlogger.error(vehiclesTypes);
            const er = {
                state: 'error',
                data: 'Missing vehicle type information check logs'
            }
            return er;
        }

        const barInfo = await this.getDriversDistrictsDistribution();
        if (barInfo.state !== 'success') {
            return barInfo;
        }
        const TopParks = await this.getTopParkingAreas();

        const metrics = await this.getMetricsData();

        const retInfo = {
            state: 'success',
            data: {
                regions: regList.data,
                districts: distList.data,
                wards: wardList.data,
                parks: ParkList.data,
                drivers: driverList.data,
                montReg: monthRegi.data,
                topParks: TopParks,
                metrics,
                leadershipTypes,
                vehiclesTypes,
                barInfo: barInfo.data,
            }
        }
        return retInfo
    } 


















    getAllDriverInformation = async (driver_id) => {
        const driverInf = await authDbObj.selectDriverDetails([driver_id, 'active', 'created'], " `driver_id` = ? AND (`status` = ? OR `status` = ?)");
        if (!_.isArray(driverInf)) {
            this.Mlogger.error(driverInf);
            const er = {
                state: 'error',
                data: 'An error occurred while fetching driver details',
            }
            return er;
        } else if (_.isArray(driverInf) && _.isEmpty(driverInf)) {
            const er = {
                state: 'error',
                data: 'Taarifa za akaunti yako zinakosekana. Tafadhali jaribu tena baadae',
            }
            return er;
        }
        
        const driverOb = driverInf[0];
        // delete password data 
        if (typeof (driverOb.password) === 'string') {
            delete driverOb.password;
        }
        // get park information park_area
        const parkInf = await authDbObj.selectParkAreasDetails([driverOb.park_area]);
        if (!_.isArray(parkInf)) {
            this.Mlogger.error(parkInf);
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching parking information'
            }
            return er;
        } else if (_.isArray(parkInf) && _.isEmpty(parkInf)) {
            const er = {
                state: 'error',
                data: 'Taarifa juu ya kituo chako hazipatikani kwasasa. Tafadhali rudia tena'
            }
            return er;
        }

        // get driver uniform details
        const uniformDet = await authDbObj.selectUniformDetails([driver_id, 'active'], " `driver_id` = ? AND `status` = ? ");
        if (!_.isArray(uniformDet)) {
            this.Mlogger.error(uniformDet);
            driverOb.uniform = 'an error ecountered';
        } else if(_.isArray(uniformDet) && _.isEmpty(uniformDet)) {
            driverOb.uniform = 'Haijathibitishwa';
        } else {
            driverOb.uniform = uniformDet[0].uniform_num;
        }

        

        // now get leadership information if exits
        const ledInf = await authDbObj.selectParkLeaders([driver_id, 'active'], " `driver_id` = ? AND `status` = ? ");
        if (!_.isArray(ledInf)) {
            this.Mlogger.error(ledInf);
            const er = {
                state: 'error',
                data: 'An error has occurred while fetching leadership information'
            }
            return er;
        } else if(_.isArray(ledInf) && _.isEmpty(ledInf)) {
            driverOb.parkName = parkInf[0].park_name;
            driverOb.leadership = 'Mwanachama';
            driverOb.leaderState = 'no';
            const sc = {
                state: 'success',
                data:  driverOb
            }
            return sc;
        }

        // now fetch leadership type
        const letyNames = await authDbObj.selectLeaderTypes([ledInf[0].leader_type]);
        if (!_.isArray(letyNames)) {
            this.Mlogger.error(letyNames);
            driverOb.parkName = parkInf[0].park_name;
            driverOb.leadership = 'Kiongozi';
            driverOb.leaderState = 'yes';
            const sc = {
                state: 'success',
                data:  driverOb
            }
            return sc;
        } else if (_.isArray(letyNames) && _.isEmpty(letyNames)) {
            this.Mlogger.error(`Driver of id ${driver_id} has unknown leadership type`);
            driverOb.parkName = parkInf[0].park_name;
            driverOb.leadership = 'Kiongozi';
            driverOb.leaderState = 'yes';
            const sc = {
                state: 'success',
                data:  driverOb
            }
            return sc;
        }

        driverOb.parkName = parkInf[0].park_name;
        driverOb.leadership = letyNames[0].type_name;
        driverOb.leaderState = 'yes';
        const sc = {
            state: 'success',
            data:  driverOb
        }
        return sc;
        
    }
}

const AdminGetterObj = new AdminGetter();
export default AdminGetterObj;