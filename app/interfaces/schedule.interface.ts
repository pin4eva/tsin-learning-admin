export interface ISchedule {
  id: string;
  day: string;
  period: string;
  session: ISession

}
export interface ISession {
  id: string;
  name: string;
  leaders: IUser[];
  sessionUsers: IUser[];
}


export interface ICase {
  id: string;
  name: string;
  description: string;
}

export interface IUser {
  id: string;
  userId: string;
  userName: string;
  group: string;
  track: string;
  case?: {
    name: string;
    description: string;
  }
}

export interface IGroup {
  groupName: string;
  members: { case?: string; userName: string }[]
}


export interface ITrack {
  trackName: string;
  groups: IGroup[];
  leaders: IGroup[]
}

export interface ISessionTrack {
  name: string;
  tracks: ITrack[]
}
