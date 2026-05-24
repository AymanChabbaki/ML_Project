from app.predictor import predictor

def test_direct():
    smiles_list = ["CC(=O)OC1=CC=CC=C1C(=O)O", "C1=CC=C(C=C1)O"]
    response = predictor.predict(smiles_list)
    assert len(response.results) == 2
    assert response.results[0].is_valid == True
    # check that we got endpoints back
    assert len(response.results[0].predictions) > 0
    print("Direct prediction works!")

if __name__ == "__main__":
    test_direct()
