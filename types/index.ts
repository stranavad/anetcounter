export interface UserRelationshipType {
    id: number;
    name: string;
    avatarUrl: string;
    photoUrl: string | null;
    userId: string;
    relationshipId: number;
}

export interface RelationshipType {
    id: number;
    name: string;
    since: string; // date
    photoUrl: string | null;
    users: [UserRelationshipType, UserRelationshipType];
}

export interface UpdateRelationship {
    name: string;
    partner0: { id: number, name: string };
    partner1: { id: number, name: string };
    since: Date;
}

export interface RelationshipEventType {
    id: number;
    name: string;
    description: string;
    date: string;
    relationshipId: number;
    photoUrl: string | null;
}
