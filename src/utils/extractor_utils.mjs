/*
gives the current date plus a minutes shift
 */
export function getShiftedData(minutes){
    let now = new Date();
    now.setMinutes(now.getMinutes()+minutes);
    return now.toISOString();
}



