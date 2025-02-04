import React, { useEffect, useMemo, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";

import { trpc } from "../trpc.js";
import { dataActions } from "../redux/reducers/data.js";
import { useAppSelector, useAppDispatch } from "../redux/redux-hooks.js";
import { DisplayGroup } from "../../common/types/db.js";

export function Application() {
    const dispatch = useAppDispatch();
    const dgDict = useAppSelector((state) => state.data.dg);

    const dgs = useMemo(() => {
        const dgs = Object.values(dgDict);
        dgs.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        return dgs;
    }, [dgDict]);

    const [action, setAction] = useState<
        { type: "create" } | { type: "edit"; dg: DisplayGroup } | null
    >(null);

    useEffect(() => {
        const fetchData = async () => {
            const dgs = await trpc.dg.getAll.query();
            dispatch(dataActions.upsertDgs({ dgs }));
        };
        fetchData().catch(console.error);
    }, []);

    return (
        <Stack spacing={2} direction="column" alignItems="flex-start">
            <Button variant="contained" onClick={() => setAction({ type: "create" })}>
                Create new display group
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Level</TableCell>
                            <TableCell>Version</TableCell>
                            <TableCell>Created</TableCell>
                            <TableCell>Modified</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dgs.map((dg) => (
                            <TableRow key={dg.id}>
                                <TableCell>{dg.id}</TableCell>
                                <TableCell>{dg.name}</TableCell>
                                <TableCell>{dg.level}</TableCell>
                                <TableCell>{dg.version}</TableCell>
                                <TableCell>{formatDate(dg.created)}</TableCell>
                                <TableCell>{formatDate(dg.modified)}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        onClick={() => setAction({ type: "edit", dg })}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {action?.type === "create" && <CreateModal onClose={() => setAction(null)} />}
            {action?.type === "edit" && (
                <EditModal onClose={() => setAction(null)} dg={action.dg} />
            )}
        </Stack>
    );
}

interface CreateModalProps {
    onClose: () => void;
}
function CreateModal({ onClose }: CreateModalProps) {
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [level, setLevel] = useState(0);
    const [parentId, setParentId] = useState("");
    const dispatch = useAppDispatch();

    const createDg = async () => {
        const dg = await trpc.dg.create.mutate({ id, name, level, parent_id: parentId });
        dispatch(dataActions.upsertDgs({ dgs: [dg] }));
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create Display Group</DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={1} mt={3}>
                    <TextField label="ID" value={id} onChange={(e) => setId(e.target.value)} />
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Level"
                        type="number"
                        value={level}
                        onChange={(e) => setLevel(Number(e.target.value))}
                    />
                    <TextField
                        label="Parent ID"
                        value={parentId}
                        onChange={(e) => setParentId(e.target.value)}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={createDg}>
                    Create
                </Button>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

interface EditModalProps {
    onClose: () => void;
    dg: DisplayGroup;
}
function EditModal({ onClose, dg }: EditModalProps) {
    const dispatch = useAppDispatch();
    const [id, setId] = useState(dg.id);
    const [name, setName] = useState(dg.name);
    const [level, setLevel] = useState(dg.level);
    const [parentId, setParentId] = useState(dg.parent_id);

    const deleteDg = async () => {
        await trpc.dg.delete.mutate({ id: dg.id });
        dispatch(dataActions.deleteDgs({ ids: [dg.id] }));
        onClose();
    };

    const updateDg = async () => {
        const updatedDgs = await trpc.dg.update.mutate({
            id: dg.id,
            name,
            level,
            parent_id: parentId,
        });
        dispatch(dataActions.upsertDgs({ dgs: updatedDgs }));
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Edit Display Group</DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={1} mt={3}>
                    <TextField label="ID" value={id} onChange={(e) => setId(e.target.value)} />
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Level"
                        type="number"
                        value={level}
                        onChange={(e) => setLevel(Number(e.target.value))}
                    />
                    <TextField
                        label="Parent ID"
                        value={parentId}
                        onChange={(e) => setParentId(e.target.value)}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="error" onClick={deleteDg}>
                    Delete
                </Button>
                <Button variant="contained" onClick={updateDg}>
                    Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

function formatDate(date: string) {
    return new Date(date).toLocaleString();
}
