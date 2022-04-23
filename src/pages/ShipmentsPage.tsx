import { ReactElement, useEffect, useState } from "react"
import { makeStyles } from "@material-ui/core"
import { DataGrid, GridColDef } from "@material-ui/data-grid"
import { LoaderItem } from "../components/LoaderItem"
import { ErrorMessage } from "../components/ErrorMessage"
import { LoadingResult, INITIAL_RESULT } from "../utils/grid-helpers"
import { fetchShipments, FetchShipmentsResult } from "../data/fetch-shipments"

const COLUMNS: GridColDef[] = [
    {
        field: 'houseBillNumber',
        headerName: 'House Bill',
        width: 150
    },
    {
        field: 'client',
        headerName: 'Shipper',
        width: 200
    },
    {
        field: 'origin',
        headerName: 'Origin',
        width: 400
    },
    {
        field: 'destination',
        headerName: 'Destination',
        width: 400
    },
    {
        field: 'mode',
        headerName: 'Mode',
        width: 200
    },
    {
        field: 'estimatedDeparture',
        headerName: 'Estimated Departure',
        width: 200
    },
    {
        field: 'estimatedArrival',
        headerName: 'Estimated Arrival',
        width: 200
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 200
    }
]

const useStyles = makeStyles({
    grid: {
        marginInline: 16,
        height: 'calc(100vh - 72px)'
    }
})

export const ShipmentsPage: React.FC = () => {
    const classes = useStyles()

    const [fetchShipmentsResult, setFetchShipmentsResult] = useState<FetchShipmentsResult | LoadingResult>(INITIAL_RESULT)
    useEffect(() => {
        fetchShipments().then(result => setFetchShipmentsResult(result))
    }, [])

    let component: ReactElement
    switch (fetchShipmentsResult.status) {
        case 'SUCCESS':
            component = <DataGrid
                className={classes.grid}
                rows={fetchShipmentsResult.shipments}
                columns={COLUMNS}
                autoPageSize
                disableSelectionOnClick
            />
            break;
        case 'LOADING':
            component = <LoaderItem />
            break
        case 'ERROR':
            component = <ErrorMessage />
            break
    }

    return component
}