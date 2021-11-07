import * as React from 'react';
import { ReactElement } from 'react';
import { Record } from '../../types';
import { RecordContextProvider } from './RecordContext';

/**
 * Wrap children with a RecordContext provider only if the value is defined.
 *
 * Allows a component to work outside of a record context.
 *
 * @example
 *
 * import { OptionalRecordContextProvider, TextField } from 'react-admin';
 *
 * const RecordTitle = ({ record }) => (
 *     <OptionalRecordContextProvider value={record}>
 *         <TextField source="title" />
 *     </OptionalRecordContextProvider>
 * );
 */
export const OptionalRecordContextProvider = <
    RecordType extends Record | Omit<Record, 'id'> = Record
>({
    value,
    children,
}: {
    children: ReactElement;
    value?: RecordType;
}) =>
    value ? (
        <RecordContextProvider value={value}>{children}</RecordContextProvider>
    ) : (
        children
    );
