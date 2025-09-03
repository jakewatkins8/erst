/** 
 * @typedef {1|2|3|4|5|6|7|8} Stone
 * 
 * */

/** 
 * @type {{ stoneType: Stone, ranks: [number, number, number]}[]}
 * 
 * */
const valuesMap = [
    {
        stoneType: 1,
        ranks: [1, 2, 3]
    },
    {
        stoneType: 2,
        ranks: [4, 5, 6]
    },
    {
        stoneType: 3,
        ranks: [7, 8, 9]
    },
    {
        stoneType: 4,
        ranks: [10, 11, 12]
    },
    {
        stoneType: 5,
        ranks: [13, 14, 15]
    },
    {
        stoneType: 6,
        ranks: [16, 17, 18]
    },
    {
        stoneType: 7,
        ranks: [19, 20, 21]
    }
]

// Ranks is always a tuple of 3, and they always have the same weight (at least in this range that I currently know)
const weightByIndex = [2, 4, 6]



const getRequirementsByRank = (curRank, targetRank) => {

    if (curRank < 0 || curRank > 21) {
        throw new Error('Only supports ranks 0 to 21 (right now)')
    }

    // hack - compare curRank and targetRank each as a number
    curRank = Number(curRank)
    targetRank = Number(targetRank)

    // Find the respective stone given the rank
    const currStoneType = valuesMap.find(stone => stone.ranks.includes(curRank))?.stoneType

    console.log('currStoneType:', currStoneType)
    const stoneTypeIndex = valuesMap.findIndex(stone => stone.ranks.includes(curRank))

    console.log('stoneTypeIndex:', stoneTypeIndex)

    if (stoneTypeIndex < 0) {
        throw new Error('Could not find current stone ranking in any category.')
    }

    // Find same for target
    const targetStoneType = targetRank ? valuesMap.find(stone => stone.ranks.includes(targetRank))?.stoneType : undefined
    const targetStoneTypeIndex = targetRank ? valuesMap.findIndex(stone => stone.ranks.includes(targetRank)) : undefined

    console.log("weapon is currently rank +" + curRank, '- want to get to rank', targetRank || '21 (no target rank passed)')

    // Work to end and just sum the stones required (if no target rank)

    const weightsByIndex = [2, 4, 6]

    const valuesMapSlice = valuesMap.slice(stoneTypeIndex)

    /** @type {{[stoneType: number]: { [`+{number}`]: number}}}} */
    const reqs = {
        totals: {

        }
    }


    let done; // if target rank is reached

    for (const section of valuesMapSlice) {
        // For any section that the stone is NOT in (i.e. all but its own section),
        // we can just iterate the values from the start.
        // For the section it lives in,
        // we have to start from its position.

        const ranksToCheck = []
        if (section.stoneType === currStoneType) {
            // we must get our starting position in the tuple (as this is really the only one it will vary from 0/the start for)
            // The three values of this section:
            // const [first, second, third] = section.ranks
            const indexOfCurrent = section.ranks.findIndex(val => val === curRank)
            console.log('Current rank of', curRank, 'is at index', indexOfCurrent, 'in the tuple for this rank')
            // add whichever all are needed from here

            ranksToCheck.push(...section.ranks.slice(indexOfCurrent+1)) // exclude the current
        } else {
            ranksToCheck.push(...section.ranks)
        }

        for (const rank of ranksToCheck) {

            const indexOfCurrent = section.ranks.findIndex(val => val === rank)
            if (!reqs[section.stoneType]) {
                reqs[section.stoneType] = {}
            }
            reqs[section.stoneType][`+${rank}`] = weightByIndex[indexOfCurrent]
            if (!reqs.totals[section.stoneType]) {
                reqs.totals[section.stoneType] = 0
            }
            reqs.totals[section.stoneType] += weightByIndex[indexOfCurrent]

            if (rank === targetRank) {
                console.log('Just ran for target rank:', targetRank)
                done = true;
            }
        }

        if (done) {
            break;
        }
    }

    console.log(reqs)
    return reqs;




}


const args = process.argv.slice(2)

console.log('Got args:', args)

getRequirementsByRank(...args)