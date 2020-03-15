/// <reference path="chesspiece.ts" />


class Tile extends ChessPiece {
    public constructor(color:string) {
        super()

        this.width = Board.getInstance().getTileSize();
        this.height = Board.getInstance().getTileSize();
        //this.setPosition([0, 0]);
        this.style.backgroundColor = color;
    }

    public update(){
        super.update()
    }

    public getMoves(): [number, number][] {
        let moves: [number, number][] = []
        return moves;
    }

}

window.customElements.define("tile-component", Tile)