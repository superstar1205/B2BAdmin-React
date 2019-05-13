import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { useTranslate, sanitizeListRestProps } from 'ra-core';

import Actions from '../layout/Actions';

const styles = theme =>
    createStyles({
        toolbar: {
            zIndex: 3,
            color:
                theme.palette.type === 'light'
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
            justifyContent: 'space-between',
            backgroundColor:
                theme.palette.type === 'light'
                    ? lighten(theme.palette.primary.light, 0.85)
                    : theme.palette.primary.dark,
            minHeight: theme.spacing(8),
            height: theme.spacing(8),
            transition: `${theme.transitions.create(
                'height'
            )}, ${theme.transitions.create('min-height')}`,
        },
        collapsed: {
            minHeight: 0,
            height: 0,
            overflowY: 'hidden',
        },
        title: {
            flex: '0 0 auto',
        },
    });

const BulkActionsToolbar = ({
    classes,
    basePath,
    filterValues,
    label,
    resource,
    selectedIds,
    children,
    ...rest
}) => {
    const translate = useTranslate();

    return (
        <Toolbar
            data-test="bulk-actions-toolbar"
            className={classnames(classes.toolbar, {
                [classes.collapsed]: selectedIds.length == 0,
            })}
            {...sanitizeListRestProps(rest)}
        >
            <div className={classes.title}>
                <Typography color="inherit" variant="subtitle1">
                    {translate(label, {
                        _: label,
                        smart_count: selectedIds.length,
                    })}
                </Typography>
            </div>
            <Actions>
                {Children.map(children, child =>
                    cloneElement(Children.only(child), {
                        basePath,
                        filterValues,
                        resource,
                        selectedIds,
                    })
                )}
            </Actions>
        </Toolbar>
    );
};

BulkActionsToolbar.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    basePath: PropTypes.string,
    filterValues: PropTypes.object,
    label: PropTypes.string,
    resource: PropTypes.string,
    selectedIds: PropTypes.array,
};

BulkActionsToolbar.defaultProps = {
    label: 'ra.action.bulk_actions',
};

export default withStyles(styles)(BulkActionsToolbar);
