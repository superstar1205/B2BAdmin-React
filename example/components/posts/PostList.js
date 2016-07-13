import React from 'react';
import Datagrid from '../../../src/components/material-ui/list/Datagrid';
import TextField from '../../../src/components/material-ui/field/TextField';
import EditButton from '../../../src/components/material-ui/button/EditButton';

const PostList = (props) => (
    <Datagrid title="All posts" {...props}>
        <TextField label="id" source="id" />
        <TextField label="title" source="title" />
        <TextField label="published_at" source="published_at" />
        <TextField label="average_note" source="average_note" />
        <TextField label="views" source="views" />
        <EditButton basePath="/posts" />
    </Datagrid>
);

export default PostList;
