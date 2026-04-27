import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Types "../types/milestone";

module {
  public type MilestoneStore = Map.Map<Nat, Types.Milestone>;

  public func getAllMilestones(store : MilestoneStore) : [Types.Milestone] {
    let iter = store.entries();
    let sorted = iter.sort(
      func((a, _), (b, _)) = Nat.compare(a, b),
    );
    sorted.map<(Nat, Types.Milestone), Types.Milestone>(func((_, m)) = m).toArray()
  };

  public func getMilestone(store : MilestoneStore, id : Nat) : ?Types.Milestone {
    store.get(id)
  };

  public func addMilestone(
    store : MilestoneStore,
    nextId : Nat,
    step : Text,
    date : Text,
    title : Text,
    description : Text,
    status : Text,
    color : Text,
  ) : Nat {
    let milestone : Types.Milestone = {
      id = nextId;
      step;
      date;
      title;
      description;
      status;
      color;
    };
    store.add(nextId, milestone);
    nextId
  };

  public func updateMilestone(
    store : MilestoneStore,
    id : Nat,
    step : Text,
    date : Text,
    title : Text,
    description : Text,
    status : Text,
    color : Text,
  ) : Bool {
    switch (store.get(id)) {
      case null false;
      case (?existing) {
        store.add(id, { existing with step; date; title; description; status; color });
        true
      };
    }
  };

  public func deleteMilestone(store : MilestoneStore, id : Nat) : Bool {
    switch (store.get(id)) {
      case null false;
      case (?_) {
        store.remove(id);
        true
      };
    }
  };

  public func getStats(store : MilestoneStore) : Types.Stats {
    let total = store.size();
    var completed = 0;
    store.forEach(func(_, m) {
      if (m.status == "completed") { completed += 1 };
    });
    { total; completed; remaining = total - completed }
  };

  public func seedDefaults(store : MilestoneStore) {
    let seeds : [(Nat, Text, Text, Text, Text, Text, Text)] = [
      (1, "01", "2023-09-01", "First Meeting at ALBA", "Initial stakeholder alignment. Defined conference scope, goals, and preliminary budget envelope.", "completed", "red"),
      (2, "02", "2023-10-15", "Finalizing the List of Invitees", "Speaker roster confirmed. Keynote participants and delegate eligibility criteria locked in.", "completed", "blue"),
      (3, "03", "2023-10-23", "Finalize Program and Conference Fee Decision", "Schedule locked. Registration fee structure approved after steering committee review.", "completed", "yellow"),
      (4, "04", "2023-10-30", "Send Invitations", "Formal invitations dispatched with registration portal link and accommodation guidance.", "completed", "blue"),
      (5, "05", "2023-12-15", "Registration Deadline", "All delegate registrations closed and confirmed. Final headcount submitted to venue.", "completed", "indigo"),
      (6, "06", "2024-02-10", "Deadline for Presentations", "All speaker decks received, reviewed, and formatted for the main stage AV system.", "completed", "indigo"),
      (7, "07", "2024-03-01", "NorCast Conference", "Main event executed. Panels, keynotes, and networking sessions delivered across two days.", "completed", "red"),
      (8, "08", "2024-04-01", "Post-Conference Work", "Thank-you communications dispatched. Proceedings compiled and distributed to all delegates.", "completed", "red"),
    ];
    for ((id, step, date, title, description, status, color) in seeds.vals()) {
      store.add(
        id,
        { id; step; date; title; description; status; color },
      );
    };
  };
};
