import Map "mo:core/Map";
import MilestoneLib "lib/milestone";
import MilestoneMixin "mixins/milestone-api";
import Types "types/milestone";

actor {
  let store : MilestoneLib.MilestoneStore = Map.empty<Nat, Types.Milestone>();
  let nextIdCell : [var Nat] = [var 1];

  // Seed default data on first deployment (store is empty)
  if (Map.size(store) == 0) {
    MilestoneLib.seedDefaults(store);
    nextIdCell[0] := Map.size(store) + 1;
  };

  include MilestoneMixin(store, nextIdCell);
};
