import MilestoneLib "../lib/milestone";
import Types "../types/milestone";

mixin (
  store : MilestoneLib.MilestoneStore,
  nextIdCell : [var Nat],
) {
  public query func getAllMilestones() : async [Types.Milestone] {
    MilestoneLib.getAllMilestones(store)
  };

  public query func getMilestone(id : Nat) : async ?Types.Milestone {
    MilestoneLib.getMilestone(store, id)
  };

  public func addMilestone(
    step : Text,
    date : Text,
    title : Text,
    description : Text,
    status : Text,
    color : Text,
  ) : async Nat {
    let id = MilestoneLib.addMilestone(store, nextIdCell[0], step, date, title, description, status, color);
    nextIdCell[0] += 1;
    id
  };

  public func updateMilestone(
    id : Nat,
    step : Text,
    date : Text,
    title : Text,
    description : Text,
    status : Text,
    color : Text,
  ) : async Bool {
    MilestoneLib.updateMilestone(store, id, step, date, title, description, status, color)
  };

  public func deleteMilestone(id : Nat) : async Bool {
    MilestoneLib.deleteMilestone(store, id)
  };

  public query func getStats() : async Types.Stats {
    MilestoneLib.getStats(store)
  };
};
