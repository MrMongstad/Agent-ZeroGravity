module {
  public type MilestoneStatus = Text; // "completed" | "in-progress" | "upcoming"
  public type MilestoneColor = Text;  // "red" | "blue" | "yellow" | "indigo"

  public type Milestone = {
    id : Nat;
    step : Text;
    date : Text;
    title : Text;
    description : Text;
    status : MilestoneStatus;
    color : MilestoneColor;
  };

  public type Stats = {
    total : Nat;
    completed : Nat;
    remaining : Nat;
  };
};
