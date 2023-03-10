import { deleteFromDayplan, updateSelectedDayplan } from "@/partials/dayplan/dayplanSlice";
import { authFetch } from "./authFetch"

export async function getDayplans(token:string)
{
    const apiURL = 'dayplan/dayplans/mydayplans/'
    const res = await authFetch('GET', {'Authorization':'Token '+token}, apiURL, {});
    return res; 
}

export async function getSummaries(token:string)
{
    let dayplans = await getDayplans(token);
    let summaries = [];
    const extra = dayplans[dayplans?.length-1];
    if(dayplans)
    {
        for(let i =0; i<dayplans.length - 1; i++)
        {
            const summary = dayplans[i]; 
            summaries.push(
                {
                    id: summary.id,
                    day: summary.day,
                    goal: summary.goal,
                    eaten: extra.extra[summary.day]
                }
            )
        }
    }

    return summaries;
}

export function getDayName(day:string)
{
    const dict = {
        "SU": "Sunday",
        "MO": "Monday",
        "TU": "Tuesday",
        "WE": "Wednesday",
        "TH": "Thursday",
        "FR": "Friday",
        "SA": "Saturday"
    }

    return dict[day];
}

export async function fetchDayplanDetails(token, id)
{
    const apiURL = `dayplan/dayplans/${id}/view/`
    const res = await authFetch('GET', {'Authorization':'Token '+token}, apiURL, {});
    return res; 
}

export async function getDayplanDetails(token, id)
{
    const res = await fetchDayplanDetails(token, id);
    const new_dayplan = {
        id: res.dayplan[0].id,
        day: res.dayplan[0].day,
        goal: res.dayplan[0].goal,
        food: res.food,
        lift: res.lift,
        cardio: res.cardio
    }

    return new_dayplan;
}

export async function createFitObject(dispatch, dayplanId, token, type, object)
{
    let new_object = {};

    if(object.id === -1)
    {
        const apiURL = `dayplan/dayplans/${dayplanId}/${type}/`
        const res = await authFetch('POST', {'Authorization':'Token '+token}, apiURL, object)
        new_object = res[0];
    }
    else 
    {
        let type_url = type;
        if(type_url === 'lift')
            type_url = 'lifts';

        const apiURL = `dayplan/${type_url}/${object.id}/update/`
        const res = await authFetch('POST', {'Authorization':'Token '+token}, apiURL, object)
        new_object = res[0];
    }

    dispatch(updateSelectedDayplan(
        {
            type: type,
            id: new_object['id'],
            new_object: new_object
        }
    ))
}

export async function deleteFitObject(dispatch, token, type, object)
{
    let new_object = {};
    
    let type_url = type;
    if(type_url === 'lift')
        type_url = 'lifts';

    const apiURL = `dayplan/${type_url}/${object.id}/delete/`
    const res = await authFetch('POST', {'Authorization':'Token '+token}, apiURL, {})
    new_object = res[0];
    
    dispatch(deleteFromDayplan(
        {
            type: type,
            id: object['id']
        }
    ))
}