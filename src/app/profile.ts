

export interface Profile {
    Id: string,
    EmpId: string,
    Name: string,
    Email: string,
    Role: Role,
    TeamName: string,
    Password: string,
    Leave: Leave[]
}


interface Leave {
    Date: string,
    Day: string,
    LeaveType: LeaveType
}
enum Role {
    DEV = 0,
    QA = 1
}
enum LeaveType {
    Leave = 0,
    ComapanyHoliday = 1,
    Weekend = 2,
    Half_Day_Leave = 3,
    Tentative_Leave = 4,
    Weekend_Work = 5
}
