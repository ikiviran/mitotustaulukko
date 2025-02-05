import React from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

import { useAppSelector } from "../redux/redux-hooks.js";

export function AuditTable() {
    const auditLogs = useAppSelector((state) => state.data.auditLogs);

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Created</TableCell>
                        <TableCell>Table</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Data</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {auditLogs.map((auditLog) => (
                        <TableRow key={auditLog.id}>
                            <TableCell>{formatDate(auditLog.created)}</TableCell>
                            <TableCell>{auditLog.table_name}</TableCell>
                            <TableCell>{auditLog.action}</TableCell>
                            <TableCell>{auditLog.user_id}</TableCell>
                            <TableCell>
                                {JSON.stringify(auditLog.data).substring(0, 40) + "..."}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function formatDate(date: string) {
    return new Date(date).toLocaleString();
}
