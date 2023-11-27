const driversModel = {
    getAll: `
        SELECT
            *
        FROM
            drivers
    `,
    getById: `
        SELECT
            *
        FROM
            drivers
        WHERE
            driverId = ?
    `,
    getByRef: `
        SELECT
            *
        FROM
            drivers
        WHERE
            driverRef = ?

    `,
    getByCode: `
        SELECT
            *
        FROM
            drivers
        WHERE
            code = ?

    `,
    addDriver: `
        INSERT INTO
            drivers (
                driverRef, 
                number, 
                code, 
                forename, 
                surname, 
                dob, 
                nationality, 
                url
            )
        VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?
        )
        `,
    getByNames: `
            SELECT
                *
            FROM
                drivers
            WHERE
                forename=? AND surname = ?
        `,
    modDriver: `
                UPDATE 
                    drivers
                SET
                    driverRef = ?, 
                    number = ?, 
                    code = ?, 
                    forename = ?, 
                    surname = ?, 
                    dob = ?, 
                    nationality = ?, 
                    url = ?
                WHERE
                    driverId = ?
        `,
    deleteDriver: `
            DELETE FROM
                drivers
            WHERE
                driverId = ?
        `
};

module.exports = driversModel;