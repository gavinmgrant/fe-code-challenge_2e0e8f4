import { ReactElement, useEffect, useState } from "react"
import { makeStyles, Card, CardContent, Grid } from "@material-ui/core"
import { DataGrid, GridColDef } from "@material-ui/data-grid"
import dayjs from "dayjs"
import { LoaderItem } from "../components/LoaderItem"
import { ErrorMessage } from "../components/ErrorMessage"
import { LoadingResult, INITIAL_RESULT } from "../utils/grid-helpers"
import { fetchShipments, FetchShipmentsResult } from "../data/fetch-shipments"

const COLUMNS: GridColDef[] = [
    {
        field: 'houseBillNumber',
        headerName: 'House Bill',
        width: 150, 
        cellClassName: 'houseBillNumber',
    },
    {
        field: 'client',
        headerName: 'Shipper',
        width: 200
    },
    {
        field: 'status',
        headerName: 'Status',
        width: 200
    }
]

const useStyles = makeStyles({
    container: {
        padding: '0 16px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        margin: '0 0 8px 0',
        fontSize: '18px'
    },
    grid: {
        height: '210px',
        '& .houseBillNumber': {
            backgroundColor: '#e0f2ef',
            fontWeight: 'bold'
        }  
    },
    noShipments: {
        margin: '0 auto',
        paddingTop: 80,
        height: 0
    }
})

export const DashboardPage: React.FC = () => {
    const classes = useStyles()

    const [upcomingWeek, setUpcomingWeek] = useState<string[]>([])
    const NoShipments = (day: string) => {
        return <p className={classes.noShipments}>{`There are no shipments expected ${day}.`}</p>
    }

    const [fetchShipmentsResult, setFetchShipmentsResult] = useState<FetchShipmentsResult | LoadingResult>(INITIAL_RESULT)
    useEffect(() => {
        fetchShipments().then(result => setFetchShipmentsResult(result))
        const today = dayjs()
        for (let i = 0; i < 7; i++) {
            const date = dayjs(today).add(i, 'day').format('MM/DD/YY');
            setUpcomingWeek(prev => [...prev, date])
        }
    }, [])

    let component: ReactElement
    switch (fetchShipmentsResult.status) {
        case 'SUCCESS':
            const shipmentsThisWeek = fetchShipmentsResult.shipments.filter(shipment => {
                const today = dayjs()
                const estimatedArrival = dayjs(shipment.estimatedArrival)
                const sevenDaysFromNow = dayjs(today).add(7, 'day')
                return estimatedArrival > today && estimatedArrival < sevenDaysFromNow    
            })
            component = <Grid container spacing={2} className={classes.container}>
                {upcomingWeek.map((day, i) => {
                    const shipmentsOnDay = shipmentsThisWeek.filter(shipment => {
                        return shipment.estimatedArrival === day
                    })
                    const dayOfWeek = i === 0 ? 'Today' : dayjs(day).format('dddd')
                    return (
                        <Grid item xs={12} md={6} xl={4} key={day}>
                            <Card variant="outlined">
                                <CardContent>
                                <header className={classes.header}>
                                    <h2 className={classes.title}>Arriving {dayOfWeek}</h2>
                                    <h2 className={classes.title}>{day}</h2>
                                </header>
                                <DataGrid
                                    components={{
                                        NoRowsOverlay: () => NoShipments(dayOfWeek)
                                    }}
                                    className={classes.grid}
                                    rows={shipmentsOnDay}
                                    columns={COLUMNS}
                                    disableSelectionOnClick
                                    hideFooter
                                />
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
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