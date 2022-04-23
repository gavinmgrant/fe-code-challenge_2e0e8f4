import { Box, makeStyles, useTheme } from "@material-ui/core"
import Loader from 'react-loader-spinner'

const useStyles = makeStyles({
    loader: {
        margin: 'auto',
        width: 'fit-content',
        marginTop: 200
    }
})

export const LoaderItem = () => {
    const classes = useStyles()
    const theme = useTheme()

    return (
        <Box className={classes.loader}>
            <Loader type="Grid" color={theme.palette.primary.main} />
        </Box >
    )
}