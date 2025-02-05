import React, { useEffect, useMemo, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputLabel,
    MenuItem,
    Paper,
    Select,
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
    const [, setRerender] = useState(0);

    const dgs = useMemo(() => {
        const dgs = Object.values(dgDict);
        dgs.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
        return dgs;
    }, [dgDict]);

    // Update highlights by re-rendering after 3 seconds whenever the dgDict changes
    useEffect(() => {
        const interval = setInterval(() => {
            setRerender((prev) => prev + 1);
        }, 3000);
        return () => clearInterval(interval);
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
                            <TableCell>Code</TableCell>
                            <TableCell>Parent</TableCell>
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
                            <TableRow
                                key={dg.id}
                                className={isRecentlyUpdated(dg) ? "highlight" : ""}
                            >
                                <TableCell>{dg.code}</TableCell>
                                <TableCell>
                                    {dg.parent_id ? dgDict[dg.parent_id]?.code : null}
                                </TableCell>
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
            {action?.type === "create" && <CreateModal dgs={dgs} onClose={() => setAction(null)} />}
            {action?.type === "edit" && (
                <EditModal dgs={dgs} dg={action.dg} onClose={() => setAction(null)} />
            )}
        </Stack>
    );
}

interface CreateModalProps {
    dgs: DisplayGroup[];
    onClose: () => void;
}
function CreateModal({ dgs, onClose }: CreateModalProps) {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [level, setLevel] = useState(0);
    const [parentId, setParentId] = useState<number | null>(null);
    const dispatch = useAppDispatch();

    const createDg = async () => {
        const dg = await trpc.dg.create.mutate({ code, name, level, parent_id: parentId });
        dispatch(dataActions.upsertDgs({ dgs: [dg] }));
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create Display Group</DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={1} mt={3}>
                    <TextField
                        label="Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
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
                    <InputLabel id="parent-dg">Parent</InputLabel>
                    <Select
                        labelId="parent-dg"
                        label="Parent Dg"
                        value={parentId ?? ""}
                        onChange={(e) => setParentId(Number(e.target.value))}
                    >
                        {dgs.map((dg) => (
                            <MenuItem key={dg.id} value={dg.id}>
                                {dg.code}
                            </MenuItem>
                        ))}
                    </Select>
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
    dgs: DisplayGroup[];
    dg: DisplayGroup;
    onClose: () => void;
}
function EditModal({ dgs, dg, onClose }: EditModalProps) {
    const dispatch = useAppDispatch();
    const [code, setCode] = useState("");
    const [name, setName] = useState(dg.name);
    const [level, setLevel] = useState(dg.level);
    const [parentId, setParentId] = useState<number | null>(dg.parent_id);

    const deleteDg = async () => {
        await trpc.dg.delete.mutate({ id: dg.id });
        dispatch(dataActions.deleteDgs({ ids: [dg.id] }));
        onClose();
    };

    const updateDg = async () => {
        const updatedDgs = await trpc.dg.update.mutate({
            id: dg.id,
            code,
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
                    <TextField label="ID" value={dg.id} disabled />
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
                    <InputLabel id="parent-dg">Parent</InputLabel>
                    <Select
                        labelId="parent-dg"
                        label="Parent Dg"
                        value={parentId ?? ""}
                        onChange={(e) => setParentId(Number(e.target.value))}
                    >
                        {dgs
                            .filter((v) => v.id !== dg.id)
                            .map((v) => (
                                <MenuItem key={v.id} value={v.id}>
                                    {v.code}
                                </MenuItem>
                            ))}
                    </Select>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Stack direction="row" justifyContent="space-between" width="100%">
                    <Button variant="contained" color="error" onClick={deleteDg}>
                        Delete
                    </Button>
                    <Stack direction="row" spacing={1}>
                        <Button variant="contained" onClick={updateDg}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </Stack>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}

function isRecentlyUpdated(dg: DisplayGroup) {
    const now = new Date();
    const modified = new Date(dg.modified);
    return modified.getTime() > now.getTime() - 1000 * 3;
}

function formatDate(date: string) {
    return new Date(date).toLocaleString();
}
