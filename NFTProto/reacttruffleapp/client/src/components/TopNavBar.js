import React from "react";
import {
    Typography,
    Toolbar,
    AppBar,
    IconButton
} from '@material-ui/core'
import { useHistory } from "react-router-dom";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const TopNavBar = React.memo(props => {
    let history = useHistory();
    const openProfile = (e) => {
        history.push({ pathname: "/profile" })
    }
    const backHome = () => {
        history.push({ pathname: "/" })
    }
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Typography onClick={backHome} variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    NFT MARKET
                </Typography>
                <IconButton onClick={openProfile} style={{ right: '20px', position: 'absolute' }}>
                    <FontAwesomeIcon icon={faUser} />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
});

export default TopNavBar;