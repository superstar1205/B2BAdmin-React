import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import ContentSort from 'material-ui/svg-icons/content/sort';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import { queryParameters } from '../../src/util/fetch';
import { fetchList } from '../../src/list/data/actions';
import { setSort } from '../../src/list/sort/actions';

class App extends Component {
    constructor(props) {
        super(props);
        this.refresh = this.refresh.bind(this);
        this.updateSort = this.updateSort.bind(this);
    }

    componentDidMount() {
        this.props.fetchListAction(this.props.resource, this.getPath(this.props.params));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.sort.field !== this.props.params.sort.field
         || nextProps.params.sort.order !== this.props.params.sort.order
         || nextProps.params.sort.filter !== this.props.params.sort.filter) {
            this.props.fetchListAction(this.props.resource, this.getPath(nextProps.params));
        }
    }

    getPath(params) {
        const query = {
            sort: JSON.stringify([params.sort.field, params.sort.order]),
        };
        if (params.filter) {
            query._filter = params.filter;
        }
        return `${this.props.path}?${queryParameters(query)}`;
    }

    refresh(event) {
        event.stopPropagation();
        this.props.fetchListAction(this.props.resource, this.getPath(this.props.params));
    }

    updateSort(event) {
        event.stopPropagation();
        this.props.setSortAction(this.props.resource, event.currentTarget.dataset.sort);
    }

    render() {
        const { data, children, params } = this.props;
        return (
            <div>
                <Toolbar style={{ backgroundColor: '#fff' }}>
                    <ToolbarGroup firstChild="true">
                    </ToolbarGroup>
                    <ToolbarGroup lastChild="true">
                        <FlatButton label="Refresh" onClick={this.refresh} icon={<NavigationRefresh/>} />
                    </ToolbarGroup>
                </Toolbar>
                <Table multiSelectable>
                    <TableHeader>
                        <TableRow>
                            {React.Children.map(children, child => (
                                <TableHeaderColumn key={child.props.label}>
                                    <FlatButton labelPosition="before" onClick={this.updateSort} data-sort={child.props.source} label={child.props.label} icon={child.props.source == params.sort.field ? <ContentSort style={{ height:'78px', color: 'red', transform: 'rotate(180deg)' }}/> : false} />
                                </TableHeaderColumn>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody showRowHover stripedRows>
                        {data.allIds.map(id => (
                            <TableRow key={id}>
                                {React.Children.map(children, column => (
                                    <TableRowColumn key={`${id}-${column.props.source}`}>
                                        <column.type { ...column.props } record={data.byId[id]} />
                                    </TableRowColumn>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

App.propTypes = {
    resource: PropTypes.string.isRequired,
    path: PropTypes.string,
    params: PropTypes.object.isRequired,
    fetchListAction: PropTypes.func.isRequired,
};

function mapStateToProps(state, props) {
    return { params: state[props.resource].list, data: state[props.resource].data };
}

export default connect(
  mapStateToProps,
  { fetchListAction: fetchList, setSortAction: setSort },
)(App);
