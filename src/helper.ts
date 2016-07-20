import * as _ from 'lodash';
import {Roles} from "./constants";
export class Helpers{
    public static getNumberOfCreepsByRole(role : Roles) : number{
        return _.filter(Game.creeps, function (x : Creep) {
            return x.memory.role == role;
        }).length;
    }

    public static getNumberOfCreepsByRoleAndRoom(role : Roles, room : string) : number{
        return _.filter(Game.creeps, function(x : Creep){
            return x.memory.role == role && x.memory.homeRoomName == room;
        }).length;
    }

    public static getSourcesByRoom(room : Room, mustBeSafe : boolean = true) : Source[] {
        var sources = room.find(FIND_SOURCES);
        if(mustBeSafe){
            sources = _.filter(sources, function(x : Source){
                var nearbyCreeps = x.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
                var valid = (!nearbyCreeps || nearbyCreeps.length == 0);
                if(valid) {
                    var nearbyEvilBuildings = x.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
                    valid = (!nearbyEvilBuildings || nearbyEvilBuildings.length == 0);
                }
                return valid;
            });
        }
        return sources;
    }

    public static getUnworkedSourcesByRoom(room : Room, mustBeSafe : boolean = true) : Source[]{
        var sources = _.filter(Helpers.getSourcesByRoom(room, mustBeSafe), function(x : Source){
            return _.filter(Game.creeps, function(c : Creep){
                    return c.memory.source == x.id;
                }).length <= 0;
        });
        return sources;
    }

    public static assignSourceToCreep(source : Source, creep : Creep) : void{
        creep.memory.source = source.id;
    }

    public static cleanDeadMemory() : void{
        for(let key in Memory.creeps){
            if(!Game.creeps[key]){
                console.log("Deleting creep " + key + " from the memory");
                delete Memory.creeps[key];
            }
        }
    }

    public static getFirstCreepAssignedToSource(sourceId : string) : Creep{
        var creeps = _.filter(Game.creeps, function(x : Creep){
            return x.memory.source == sourceId;
        });
        if(creeps && creeps.length >= 1){
            return creeps[0];
        }
        return null;
    }
}