export function load({ params }: any) {
    return {
        tournamentslug: params.tournamentid,
        params: params
    }
}