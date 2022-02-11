import * as React from 'react';
import { ReactNode, useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useTranslate, useGetIdentity } from 'ra-core';
import {
    Tooltip,
    IconButton,
    Menu,
    Button,
    Avatar,
    PopoverOrigin,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

/**
 * The UserMenu component renders a Mui Button that shows a Menu with at least the logout action.
 * It accepts children that must be Mui MenuItem components.
 *
 * @example
 * import { Logout, MenuItemLink, UserMenu } from 'react-admin';
 *
 * export const MyUserMenu = () => (
 *     <UserMenu>
 *         <MenuItemLink
 *             to="/configuration"
 *             primaryText="pos.configuration"
 *             leftIcon={<SettingsIcon />}
 *             sidebarIsOpen
 *         />
 *         <Logout />
 *     </UserMenu>
 * )
 * @param props
 * @param {ReactNode} props.children React node/s to be rendered as children of the UserMenu. Must be Mui MenuItem components
 * @param {string} props.className CSS class applied to the MuiAppBar component
 * @param {string} props.label The label of the UserMenu button. Accepts translation keys
 * @param {Element} props.icon The icon of the UserMenu button.
 *
 */
export const UserMenu = (props: UserMenuProps) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const translate = useTranslate();
    const { loaded, identity } = useGetIdentity();

    const {
        children,
        className,
        label = 'ra.auth.user_menu',
        icon = defaultIcon,
    } = props;

    if (!children) return null;
    const open = Boolean(anchorEl);

    const handleMenu = event => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <Root className={className}>
            {loaded && identity?.fullName ? (
                <Button
                    aria-label={label && translate(label, { _: label })}
                    className={UserMenuClasses.userButton}
                    color="inherit"
                    startIcon={
                        identity.avatar ? (
                            <Avatar
                                className={UserMenuClasses.avatar}
                                src={identity.avatar}
                                alt={identity.fullName}
                            />
                        ) : (
                            icon
                        )
                    }
                    onClick={handleMenu}
                >
                    {identity.fullName}
                </Button>
            ) : (
                <Tooltip title={label && translate(label, { _: label })}>
                    <IconButton
                        aria-label={label && translate(label, { _: label })}
                        aria-owns={open ? 'menu-appbar' : null}
                        aria-haspopup={true}
                        color="inherit"
                        onClick={handleMenu}
                        size="large"
                    >
                        {icon}
                    </IconButton>
                </Tooltip>
            )}
            <Menu
                id="menu-appbar"
                disableScrollLock
                anchorEl={anchorEl}
                anchorOrigin={AnchorOrigin}
                transformOrigin={TransformOrigin}
                open={open}
                onClose={handleClose}
            >
                {children}
            </Menu>
        </Root>
    );
};

UserMenu.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    label: PropTypes.string,
    icon: PropTypes.node,
};

export interface UserMenuProps {
    children?: ReactNode;
    className?: string;
    label?: string;
    icon?: ReactNode;
}

const PREFIX = 'RaUserMenu';

export const UserMenuClasses = {
    userButton: `${PREFIX}-userButton`,
    avatar: `${PREFIX}-avatar`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${UserMenuClasses.userButton}`]: {
        textTransform: 'none',
    },

    [`& .${UserMenuClasses.avatar}`]: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
}));

const defaultIcon = <AccountCircle />;

const AnchorOrigin: PopoverOrigin = {
    vertical: 'bottom',
    horizontal: 'right',
};

const TransformOrigin: PopoverOrigin = {
    vertical: 'top',
    horizontal: 'right',
};
