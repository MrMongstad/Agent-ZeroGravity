import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Stats {
    total: bigint;
    completed: bigint;
    remaining: bigint;
}
export type MilestoneColor = string;
export type MilestoneStatus = string;
export interface Milestone {
    id: bigint;
    status: MilestoneStatus;
    title: string;
    date: string;
    color: MilestoneColor;
    step: string;
    description: string;
}
export interface backendInterface {
    addMilestone(step: string, date: string, title: string, description: string, status: string, color: string): Promise<bigint>;
    deleteMilestone(id: bigint): Promise<boolean>;
    getAllMilestones(): Promise<Array<Milestone>>;
    getMilestone(id: bigint): Promise<Milestone | null>;
    getStats(): Promise<Stats>;
    updateMilestone(id: bigint, step: string, date: string, title: string, description: string, status: string, color: string): Promise<boolean>;
}
