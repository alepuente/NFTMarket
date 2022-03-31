import React from "react";
import {
    Typography,
    Toolbar,
    AppBar,
} from '@material-ui/core'


const BottomNavBar = React.memo(props => {
    return (
        <AppBar position="fixed" style={{ top: 'auto', bottom: 0 }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                </Typography>
            </Toolbar>
        </AppBar>
    )
});

export default BottomNavBar;