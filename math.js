function vproduct(matrix, vector) {
    return [vector[0]*matrix[0][0]+vector[1]*matrix[0][1],
            vector[0]*matrix[1][0]+vector[1]*matrix[1][1]];
}

function sproduct(scalar, matrix) {
    return [[scalar*matrix[0][0], scalar*matrix[0][1]],
            [scalar*matrix[1][0], scalar*matrix[1][1]]]
}

function mproduct(m1, m2) {
    return [[m1[0][0]*m2[0][0]+m1[0][1]*m2[1][0], m1[0][0]*m2[0][1]+m1[0][1]*m2[1][1]],
            [m1[1][0]*m2[0][0]+m1[1][1]*m2[1][0], m1[1][0]*m2[0][1]+m1[1][1]*m2[1][1]]];
}

function length(vector) {
    return Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
}

function sub(vec1, vec2) {
    return [vec1[0] - vec2[0], vec1[1] - vec2[1]]
}

function add(v1, v2) {
    return [v1[0] + v2[0], v1[1] + v2[1]]
}