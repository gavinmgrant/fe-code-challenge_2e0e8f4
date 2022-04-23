import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
    error: {
        margin: 16,
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export const ErrorMessage: React.FC = () => {
    const classes = useStyles()

    return (
        <p className={classes.error}>
            We had a slight issue loading your shipments. Please try again.
        </p>
    )
}
